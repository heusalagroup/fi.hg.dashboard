// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../core/LogService";
import { SimpleRepositoryEntry } from "../../core/simpleRepository/types/SimpleRepositoryEntry";
import { map } from "../../core/functions/map";
import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { StoredWorkspaceRepositoryItem } from "../types/repository/workspace/StoredWorkspaceRepositoryItem";
import { parseWorkspaceRepositoryItem, toStoredWorkspaceRepositoryItem, WorkspaceRepositoryItem } from "../types/repository/workspace/WorkspaceRepositoryItem";
import { SimpleRepositoryServiceEvent } from "../../core/simpleRepository/types/SimpleRepositoryServiceEvent";
import { SimpleRepositoryService } from "../../core/simpleRepository/types/SimpleRepositoryService";
import { SimpleSharedClientService } from "../../core/simpleRepository/types/SimpleSharedClientService";
import { SimpleRepositoryInitializer } from "../../core/simpleRepository/types/SimpleRepositoryInitializer";
import { SimpleRepository } from "../../core/simpleRepository/types/SimpleRepository";

const LOG = LogService.createLogger('WorkspaceRepositoryService');

export type WorkspaceRepositoryServiceDestructor = ObserverDestructor;

export class WorkspaceRepositoryService implements SimpleRepositoryService<StoredWorkspaceRepositoryItem> {

    public Event = SimpleRepositoryServiceEvent;

    protected readonly _sharedClientService : SimpleSharedClientService;
    protected readonly _observer            : Observer<SimpleRepositoryServiceEvent>;
    protected _repository                   : SimpleRepository<StoredWorkspaceRepositoryItem>  | undefined;
    protected _repositoryInitializer        : SimpleRepositoryInitializer<StoredWorkspaceRepositoryItem>;

    public constructor (
        sharedClientService   : SimpleSharedClientService,
        repositoryInitializer : SimpleRepositoryInitializer<StoredWorkspaceRepositoryItem>
    ) {
        this._observer = new Observer<SimpleRepositoryServiceEvent>("WorkspaceRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: SimpleRepositoryServiceEvent,
        callback: ObserverCallback<SimpleRepositoryServiceEvent>
    ): WorkspaceRepositoryServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public async initialize () : Promise<void> {
        LOG.debug(`Initialization started`);
        await this._sharedClientService.waitForInitialization();
        const client = this._sharedClientService.getClient();
        if (!client) throw new TypeError(`Client not configured`);
        this._repository = await this._repositoryInitializer.initializeRepository( client );
        LOG.debug(`Initialization finished`);
        if (this._observer.hasCallbacks(SimpleRepositoryServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(SimpleRepositoryServiceEvent.INITIALIZED);
        }
    }

    public async getAllWorkspaces () : Promise<readonly WorkspaceRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredWorkspaceRepositoryItem>[] = await this._getAllWorkspaces();
        return map(list, (item: SimpleRepositoryEntry<StoredWorkspaceRepositoryItem>) : WorkspaceRepositoryItem => {
            return parseWorkspaceRepositoryItem(
                item.id,
                item.data
            );
        });
    }

    public async getSomeWorkspaces (
        idList : readonly string[]
    ) : Promise<readonly WorkspaceRepositoryItem[]> {
        const list : readonly SimpleRepositoryEntry<StoredWorkspaceRepositoryItem>[] = await this._getSomeWorkspaces(idList);
        return map(list, (item: SimpleRepositoryEntry<StoredWorkspaceRepositoryItem>) : WorkspaceRepositoryItem => {
            return parseWorkspaceRepositoryItem(
                item.id,
                item.data
            );
        });
    }

    public async getWorkspaceById (id: string) : Promise<WorkspaceRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`WorkspaceRepositoryService: No repository constructed`);
        const foundItem : SimpleRepositoryEntry<StoredWorkspaceRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return parseWorkspaceRepositoryItem(
            foundItem.id,
            foundItem.data
        );
    }

    public async deleteAllWorkspaces () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`WorkspaceRepositoryService: No repository constructed`);
        const list : readonly SimpleRepositoryEntry<StoredWorkspaceRepositoryItem>[] = await this._getAllWorkspaces();
        await this._repository.deleteByList(list);
    }

    public async deleteSomeWorkspaces (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`WorkspaceRepositoryService: No repository constructed`);
        const list : readonly SimpleRepositoryEntry<StoredWorkspaceRepositoryItem>[] = await this._getSomeWorkspaces(idList);
        await this._repository.deleteByList(list);
    }

    public async saveWorkspace (
        item : WorkspaceRepositoryItem
    ) : Promise<WorkspaceRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`WorkspaceRepositoryService: No repository constructed`);
        const foundItem = await this._repository.updateOrCreateItem(toStoredWorkspaceRepositoryItem(item));
        return parseWorkspaceRepositoryItem(foundItem.id, foundItem.data);
    }

    // PRIVATE METHODS

    private async _getAllWorkspaces () : Promise<readonly SimpleRepositoryEntry<StoredWorkspaceRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`WorkspaceRepositoryService: No repository constructed`);
        return await this._repository.getAll();
    }

    private async _getSomeWorkspaces (
        idList : readonly string[]
    ) : Promise<readonly SimpleRepositoryEntry<StoredWorkspaceRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`WorkspaceRepositoryService: No repository constructed`);
        return await this._repository.getSome(idList);
    }

}
