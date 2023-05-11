// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isJsonString } from "../../../../core/Json";
import { SimpleStoredRepositoryItem } from "../../../../core/simpleRepository/types/SimpleStoredRepositoryItem";
import { isString } from "../../../../core/types/String";
import { isRegularObject } from "../../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../core/types/OtherKeys";

export interface StoredWorkspaceRepositoryItem extends SimpleStoredRepositoryItem {
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
