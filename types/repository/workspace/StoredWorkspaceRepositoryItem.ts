// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isJsonString } from "../../../../core/Json";
import { hasNoOtherKeysInDevelopment, isRegularObject, isString } from "../../../../core/modules/lodash";
import { StoredRepositoryItem } from "../../../../core/simpleRepository/types/StoredRepositoryItem";

export interface StoredWorkspaceRepositoryItem extends StoredRepositoryItem {
    readonly id             : string;
    readonly target         : string; // Current item data as JSON string
}

export function createStoredWorkspaceRepositoryItem (
    id     : string,
    target : string
) : StoredWorkspaceRepositoryItem {
    return {id, target};
}

export function isStoredWorkspaceRepositoryItem (value : any) : value is StoredWorkspaceRepositoryItem {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'id',
            'target'
        ])
        && isString(value?.id)
        && isJsonString(value?.target)
    )
}
