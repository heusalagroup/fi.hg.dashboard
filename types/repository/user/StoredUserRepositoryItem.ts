// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { toLower } from "../../../../../../io/hyperify/core/functions/toLower";
import { SimpleStoredRepositoryItem } from "../../../../../../io/hyperify/core/simpleRepository/types/SimpleStoredRepositoryItem";
import { isJsonString } from "../../../../../../io/hyperify/core/Json";
import { isString } from "../../../../../../io/hyperify/core/types/String";
import { isRegularObject } from "../../../../../../io/hyperify/core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../../io/hyperify/core/types/OtherKeys";

export interface StoredUserRepositoryItem extends SimpleStoredRepositoryItem {
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
