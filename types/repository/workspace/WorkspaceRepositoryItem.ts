// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isWorkspace, Workspace } from "../../Workspace";
import { isStoredWorkspaceRepositoryItem, StoredWorkspaceRepositoryItem } from "./StoredWorkspaceRepositoryItem";
import { LogService } from "../../../../../../io/hyperify/core/LogService";
import { SimpleRepositoryItem } from "../../../../../../io/hyperify/core/simpleRepository/types/SimpleRepositoryItem";
import { parseJson } from "../../../../../../io/hyperify/core/Json";
import { isString } from "../../../../../../io/hyperify/core/types/String";
import { isRegularObject } from "../../../../../../io/hyperify/core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../../../../io/hyperify/core/types/OtherKeys";

const LOG = LogService.createLogger('WorkspaceRepositoryItem');

export interface WorkspaceRepositoryItem extends SimpleRepositoryItem<Workspace> {
    readonly id: string;
    readonly target: Workspace;
}

export function createWorkspaceRepositoryItem (
    id: string,
    target: Workspace
): WorkspaceRepositoryItem {
    return {id, target};
}

export function isWorkspaceRepositoryItem (value: any): value is WorkspaceRepositoryItem {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'id',
            'target'
        ])
        && (isString(value?.id) && !!value?.id)
        && isWorkspace(value?.target)
    );
}

export function parseWorkspaceRepositoryItem (
    id: string,
    value: StoredWorkspaceRepositoryItem
): WorkspaceRepositoryItem {
    if ( !isStoredWorkspaceRepositoryItem(value) ) {
        throw new TypeError(`parseWorkspaceRepositoryItem: Invalid value for id: ${id}`);
    }
    const item = {
        id: id,
        target: parseJson(value.target)
    };
    if ( !isWorkspaceRepositoryItem(item) ) {
        LOG.debug(`item: `, item);
        throw new TypeError(`parseWorkspaceRepositoryItem: Item is not WorkspaceRepositoryItem by id: ${id}`);
    }
    return item;
}

export function toStoredWorkspaceRepositoryItem (item: WorkspaceRepositoryItem): StoredWorkspaceRepositoryItem {
    return {
        id: item.id,
        target: JSON.stringify(item.target)
    };
}
