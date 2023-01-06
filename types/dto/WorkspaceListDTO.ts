// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isWorkspace, Workspace } from "../Workspace";
import { isRegularObject } from "../../../core/types/RegularObject";
import { hasNoOtherKeysInDevelopment } from "../../../core/types/OtherKeys";
import { isArrayOf } from "../../../core/types/Array";

export interface WorkspaceListDTO {
    readonly payload : readonly Workspace[];
}

export function createWorkspaceListDTO (
    payload: readonly Workspace[]
): WorkspaceListDTO {
    return {payload};
}

export function isWorkspaceListDTO (value: any): value is WorkspaceListDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'payload'
        ])
        && isArrayOf(value?.payload, isWorkspace)
    );
}

export function stringifyWorkspaceListDTO (value: WorkspaceListDTO): string {
    return `WorkspaceListDTO(${value})`;
}

export function parseWorkspaceListDTO (value: any): WorkspaceListDTO | undefined {
    if ( isWorkspaceListDTO(value) ) return value;
    return undefined;
}
