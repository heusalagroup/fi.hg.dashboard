// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../core/modules/lodash";

export interface ProfileDTO {
    readonly email : string;
}

export function createProfileDTO (
    email: string
): ProfileDTO {
    return {email};
}

export function isProfileDTO (value: any): value is ProfileDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'email'
        ])
        && isString(value?.email)
    );
}

export function stringifyProfileDTO (value: ProfileDTO): string {
    return `ProfileDTO(${value})`;
}

export function parseProfileDTO (value: any): ProfileDTO | undefined {
    if ( isProfileDTO(value) ) return value;
    return undefined;
}
