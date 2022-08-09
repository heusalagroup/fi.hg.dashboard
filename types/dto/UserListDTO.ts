// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isUser, User } from "../User";
import { hasNoOtherKeysInDevelopment, isArrayOf, isRegularObject } from "../../../core/modules/lodash";

export interface UserListDTO {
    readonly payload : readonly User[];
}

export function createUserListDTO (
    payload: readonly User[]
): UserListDTO {
    return {payload};
}

export function isUserListDTO (value: any): value is UserListDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'payload'
        ])
        && isArrayOf(value?.payload, isUser)
    );
}

export function stringifyUserListDTO (value: UserListDTO): string {
    return `UserListDTO(${value})`;
}

export function parseUserListDTO (value: any): UserListDTO | undefined {
    if ( isUserListDTO(value) ) return value;
    return undefined;
}
