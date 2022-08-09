// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../core/LogService";
import { RepositoryEntry } from "../../core/simpleRepository/types/RepositoryEntry";
import { map } from "../../core/modules/lodash";
import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { StoredWorkspaceRepositoryItem } from "../types/repository/workspace/StoredWorkspaceRepositoryItem";
import { parseWorkspaceRepositoryItem, toStoredWorkspaceRepositoryItem, WorkspaceRepositoryItem } from "../types/repository/workspace/WorkspaceRepositoryItem";
import { RepositoryServiceEvent } from "../../core/simpleRepository/types/RepositoryServiceEvent";
import { RepositoryService } from "../../core/simpleRepository/types/RepositoryService";
import { SharedClientService } from "../../core/simpleRepository/types/SharedClientService";
import { RepositoryInitializer } from "../../core/simpleRepository/types/RepositoryInitializer";
import { Repository } from "../../core/simpleRepository/types/Repository";

const LOG = LogService.createLogger('WorkspaceRepositoryService');

export type WorkspaceRepositoryServiceDestructor = ObserverDestructor;

export class WorkspaceRepositoryService implements RepositoryService<StoredWorkspaceRepositoryItem> {

    public Event = RepositoryServiceEvent;

    protected readonly _sharedClientService : SharedClientService;
    protected readonly _observer            : Observer<RepositoryServiceEvent>;
    protected _repository                   : Repository<StoredWorkspaceRepositoryItem>  | undefined;
    protected _repositoryInitializer        : RepositoryInitializer<StoredWorkspaceRepositoryItem>  | undefined;

    public constructor (
        sharedClientService   : SharedClientService,
        repositoryInitializer : RepositoryInitializer<StoredWorkspaceRepositoryItem>
    ) {
        this._observer = new Observer<RepositoryServiceEvent>("WorkspaceRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: RepositoryServiceEvent,
        callback: ObserverCallback<RepositoryServiceEvent>
    ): WorkspaceRepositoryServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public async initialize () : Promise<void> {
        LOG.debug(`Initialization started`);
        await this._sharedClientService.waitForInitialization();
        this._repository = await this._repositoryInitializer.initializeRepository( this._sharedClientService.getClient() );
        LOG.debug(`Initialization finished`);
        if (this._observer.hasCallbacks(RepositoryServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(RepositoryServiceEvent.INITIALIZED);
        }
    }

    public async getAllWorkspaces () : Promise<readonly WorkspaceRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredWorkspaceRepositoryItem>[] = await this._getAllWorkspaces();
        return map(list, (item: RepositoryEntry<StoredWorkspaceRepositoryItem>) : WorkspaceRepositoryItem => {
            return parseWorkspaceRepositoryItem(
                item.id,
                item.data
            );
        });
    }

    public async getSomeWorkspaces (
        idList : readonly string[]
    ) : Promise<readonly WorkspaceRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredWorkspaceRepositoryItem>[] = await this._getSomeWorkspaces(idList);
        return map(list, (item: RepositoryEntry<StoredWorkspaceRepositoryItem>) : WorkspaceRepositoryItem => {
            return parseWorkspaceRepositoryItem(
                item.id,
                item.data
            );
        });
    }

    public async getWorkspaceById (id: string) : Promise<WorkspaceRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        const foundItem : RepositoryEntry<StoredWorkspaceRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return parseWorkspaceRepositoryItem(
            foundItem.id,
            foundItem.data
        );
    }

    public async deleteAllWorkspaces () : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredWorkspaceRepositoryItem>[] = await this._getAllWorkspaces();
        await this._repository.deleteByList(list);
    }

    public async deleteSomeWorkspaces (
        idList : readonly string[]
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        const list : readonly RepositoryEntry<StoredWorkspaceRepositoryItem>[] = await this._getSomeWorkspaces(idList);
        await this._repository.deleteByList(list);
    }

    public async saveWorkspace (
        item : WorkspaceRepositoryItem
    ) : Promise<WorkspaceRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        const foundItem = await this._repository.updateOrCreateItem(toStoredWorkspaceRepositoryItem(item));
        return parseWorkspaceRepositoryItem(foundItem.id, foundItem.data);
    }

    // PRIVATE METHODS

    private async _getAllWorkspaces () : Promise<readonly RepositoryEntry<StoredWorkspaceRepositoryItem>[]> {
        return await this._repository.getAll();
    }

    private async _getSomeWorkspaces (
        idList : readonly string[]
    ) : Promise<readonly RepositoryEntry<StoredWorkspaceRepositoryItem>[]> {
        return await this._repository.getSome(idList);
    }

}
