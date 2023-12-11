// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isJsonString } from "../../../../../../io/hyperify/core/Json";
import { SimpleStoredRepositoryItem } from "../../../../../../io/hyperify/core/simpleRepository/types/SimpleStoredRepositoryItem";
import { isString } from "../../../../../../io/hyperify/core/types/String";
import { isRegularObject } from "../../../../../../io/hyperify/core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../../io/hyperify/core/types/OtherKeys";

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
