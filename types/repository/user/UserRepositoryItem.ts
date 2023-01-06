// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isUser, User } from "../../User";
import { toLower } from "../../../../core/functions/toLower";
import { isStoredUserRepositoryItem, StoredUserRepositoryItem } from "./StoredUserRepositoryItem";
import { LogService } from "../../../../core/LogService";
import { RepositoryItem } from "../../../../core/simpleRepository/types/RepositoryItem";
import { parseJson } from "../../../../core/Json";
import { isString } from "../../../../core/types/String";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";

const LOG = LogService.createLogger('UserRepositoryItem');

export interface UserRepositoryItem extends RepositoryItem<User> {
    readonly id          : string;
    readonly workspaceId : string;
    readonly email       : string;
    readonly target      : User;
}

export function createUserRepositoryItem (
    id: string,
    workspaceId: string,
    email: string,
    target: User
): UserRepositoryItem {
    return {id, workspaceId, email: toLower(email), target};
}

export function isUserRepositoryItem (value: any): value is UserRepositoryItem {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'id',
            'workspaceId',
            'email',
            'target'
        ])
        && (isString(value?.id) && !!value?.id)
        && (isString(value?.workspaceId) && !!value?.workspaceId)
        && (isString(value?.email) && !!value?.email)
        && isUser(value?.target)
    );
}

export function parseUserRepositoryItem (
    id: string,
    workspaceId: string,
    email: string,
    value: StoredUserRepositoryItem
): UserRepositoryItem {
    if ( !isStoredUserRepositoryItem(value) ) {
        LOG.debug(`parseUserRepositoryItem: ${id}: value = `, value);
        throw new TypeError(`parseUserRepositoryItem: Argument not type of StoredUserRepositoryItem for item: ${id}`);
    }
    const item = {
        id: id,
        workspaceId: workspaceId,
        email: toLower(email),
        target: parseJson(value.target)
    };
    if ( !isUserRepositoryItem(item) ) {
        LOG.debug(`item: `, item);
        throw new TypeError(`parseUserRepositoryItem: Item is not UserRepositoryItem by id: ${id}`);
    }
    return item;
}

export function toStoredUserRepositoryItem (item: UserRepositoryItem): StoredUserRepositoryItem {
    return {
        id: item.id,
        workspaceId: item.workspaceId,
        email: toLower(item.target.email),
        target: JSON.stringify(item.target)
    };
}
