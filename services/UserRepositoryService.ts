// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../core/LogService";
import { map } from "../../core/functions/map";
import { toLower } from "../../core/functions/toLower";
import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { RepositoryEntry } from "../../core/simpleRepository/types/RepositoryEntry";
import { RepositoryServiceEvent } from "../../core/simpleRepository/types/RepositoryServiceEvent";
import { SharedClientService } from "../../core/simpleRepository/types/SharedClientService";
import { Repository } from "../../core/simpleRepository/types/Repository";
import { RepositoryInitializer } from "../../core/simpleRepository/types/RepositoryInitializer";
import { RepositoryService } from "../../core/simpleRepository/types/RepositoryService";
import { StoredUserRepositoryItem } from "../types/repository/user/StoredUserRepositoryItem";
import { UserRepositoryItem, parseUserRepositoryItem, toStoredUserRepositoryItem } from "../types/repository/user/UserRepositoryItem";

const LOG = LogService.createLogger('UserRepositoryService');

export type UserRepositoryServiceDestructor = ObserverDestructor;

export class UserRepositoryService implements RepositoryService<StoredUserRepositoryItem> {

    public Event = RepositoryServiceEvent;

    protected readonly _sharedClientService : SharedClientService;
    protected readonly _observer            : Observer<RepositoryServiceEvent>;
    protected _repository                   : Repository<StoredUserRepositoryItem>  | undefined;
    protected _repositoryInitializer        : RepositoryInitializer<StoredUserRepositoryItem>;

    public constructor (
        sharedClientService   : SharedClientService,
        repositoryInitializer : RepositoryInitializer<StoredUserRepositoryItem>
    ) {
        this._observer = new Observer<RepositoryServiceEvent>("UserRepositoryService");
        this._sharedClientService = sharedClientService;
        this._repositoryInitializer = repositoryInitializer;
        this._repository = undefined;
    }

    public on (
        name: RepositoryServiceEvent,
        callback: ObserverCallback<RepositoryServiceEvent>
    ): UserRepositoryServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public async initialize (
        roomType : string | undefined = undefined
    ) {
        LOG.debug(`Initialization started: `, roomType);
        await this._sharedClientService.waitForInitialization();
        const client = this._sharedClientService.getClient();
        if (!client) throw new TypeError(`No client configured`);
        this._repository = await this._repositoryInitializer.initializeRepository( client );
        LOG.debug(`Initialization finished: `, roomType);
        if (this._observer.hasCallbacks(RepositoryServiceEvent.INITIALIZED)) {
            this._observer.triggerEvent(RepositoryServiceEvent.INITIALIZED);
        }
    }

    public async getAllUsersByWorkspaceId (
        workspaceId: string
    ) : Promise<UserRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredUserRepositoryItem>[] = await this._getAllUsersByWorkspaceId(workspaceId);
        return map(list, (item: RepositoryEntry<StoredUserRepositoryItem>) : UserRepositoryItem => {
            return parseUserRepositoryItem(
                item.id,
                workspaceId,
                item?.data?.email,
                item.data
            );
        });
    }

    public async getAllUsersByEmail (
        email: string
    ) : Promise<UserRepositoryItem[]> {
        const list : readonly RepositoryEntry<StoredUserRepositoryItem>[] = await this._getAllUsersByEmail(email);
        return map(list, (item: RepositoryEntry<StoredUserRepositoryItem>) : UserRepositoryItem => {
            return parseUserRepositoryItem(
                item.id,
                item.data?.workspaceId,
                item.data?.email,
                item.data
            );
        });
    }

    public async getUserById (id: string) : Promise<UserRepositoryItem | undefined> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`UserRepositoryService: No repository constructed`);
        const foundItem : RepositoryEntry<StoredUserRepositoryItem> | undefined = await this._repository.findById(id);
        if (!foundItem) return undefined;
        return parseUserRepositoryItem(
            foundItem.id,
            foundItem?.data?.workspaceId,
            foundItem?.data?.email,
            foundItem.data
        );
    }

    public async deleteUsersByWorkspaceId (
        workspaceId: string
    ) : Promise<void> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`UserRepositoryService: No repository constructed`);
        const list : readonly RepositoryEntry<StoredUserRepositoryItem>[] = await this._getAllUsersByWorkspaceId(workspaceId);
        await this._repository.deleteByList(list);
    }

    public async saveUser (
        item : UserRepositoryItem
    ) : Promise<UserRepositoryItem> {
        await this._sharedClientService.waitForInitialization();
        if (!this._repository) throw new TypeError(`UserRepositoryService: No repository constructed`);
        const foundItem = await this._repository.updateOrCreateItem(toStoredUserRepositoryItem(item));
        return parseUserRepositoryItem(
            foundItem.id,
            foundItem.data?.workspaceId,
            foundItem.data?.email,
            foundItem.data
        );
    }

    // PRIVATE METHODS

    private async _getAllUsersByWorkspaceId (
        workspaceId : string
    ) : Promise<readonly RepositoryEntry<StoredUserRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`UserRepositoryService: No repository constructed`);
        return await this._repository.getAllByProperty('workspaceId', workspaceId);
    }

    private async _getAllUsersByEmail (
        email : string
    ) : Promise<readonly RepositoryEntry<StoredUserRepositoryItem>[]> {
        if (!this._repository) throw new TypeError(`UserRepositoryService: No repository constructed`);
        return await this._repository.getAllByProperty('email', toLower(email));
    }

}
