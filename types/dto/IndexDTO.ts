// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { hasNoOtherKeys, isRegularObject, isString } from "../../../core/modules/lodash";

export interface IndexDTO {
    readonly hello : string;
}

export function createIndexDTO (
    hello : string
): IndexDTO {
    return {hello};
}

export function isIndexDTO (value: any): value is IndexDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'hello'
        ])
        && isString(value?.hello)
    );
}

export function stringifyIndexDTO (value: IndexDTO): string {
    return `IndexDTO(${value})`;
}

export function parseIndexDTO (value: any): IndexDTO | undefined {
    if ( isIndexDTO(value) ) return value;
    return undefined;
}
