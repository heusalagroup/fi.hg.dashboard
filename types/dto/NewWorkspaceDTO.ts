// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isWorkspace, Workspace } from "../Workspace";
import { isUser, User } from "../User";
import { hasNoOtherKeys, isArrayOf, isRegularObject } from "../../../core/modules/lodash";

export interface NewWorkspaceDTO {

    /**
     * The new workspace model which was added
     */
    readonly payload : Workspace;

    /**
     * Users which were added to the workspace
     */
    readonly users : User[];

}

export function createNewWorkspaceDTO (
    payload : Workspace,
    users : User[]
): NewWorkspaceDTO {
    return {
        payload,
        users
    };
}

export function isNewWorkspaceDTO (value: any): value is NewWorkspaceDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'payload',
            'users'
        ])
        && isWorkspace(value?.payload)
        && isArrayOf(value?.users, isUser)
    );
}

export function stringifyNewWorkspaceDTO (value: NewWorkspaceDTO): string {
    return `NewWorkspaceDTO(${value})`;
}

export function parseNewWorkspaceDTO (value: any): NewWorkspaceDTO | undefined {
    if ( isNewWorkspaceDTO(value) ) return value;
    return undefined;
}
