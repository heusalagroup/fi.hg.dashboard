// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeysInDevelopment, isRegularObject, isString, toLower } from "../../../../core/modules/lodash";
import { StoredRepositoryItem } from "../../../../core/simpleRepository/types/StoredRepositoryItem";
import { isJsonString } from "../../../../core/Json";

export interface StoredUserRepositoryItem extends StoredRepositoryItem {
    readonly id             : string;
    readonly workspaceId    : string;
    readonly email          : string;
    readonly target         : string; // Current item data as JSON string
}

export function createStoredUserRepositoryItem (
    id          : string,
    workspaceId : string,
    email       : string,
    target      : string
) : StoredUserRepositoryItem {
    return {id, workspaceId, email: toLower(email), target};
}

export function isStoredUserRepositoryItem (value : any) : value is StoredUserRepositoryItem {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'id',
            'workspaceId',
            'email',
            'target'
        ])
        && isString(value?.id)
        && isString(value?.workspaceId)
        && isString(value?.email)
        && isJsonString(value?.target)
    )
}
