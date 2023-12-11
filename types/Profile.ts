// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { isString } from "../../../../io/hyperify/core/types/String";
import { isRegularObject } from "../../../../io/hyperify/core/types/RegularObject";
import { hasNoOtherKeys } from "../../../../io/hyperify/core/types/OtherKeys";

export interface Profile {

    /**
     * The owner email access of this profile
     */
    readonly email: string;

}

export function isProfile(value: any): value is Profile {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'email'
        ])
        && isString(value?.email)
    );
}

export function stringifyProfile(value: Profile): string {
    return `Profile(${value})`;
}

export function parseProfile(value: any): Profile | undefined {
    if (isProfile(value)) return value;
    return undefined;
}


