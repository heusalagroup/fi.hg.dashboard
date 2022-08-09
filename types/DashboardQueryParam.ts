// Copyright (c) 2022. Heusala Group <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum DashboardQueryParam {

    /**
     * Query key: `i`
     */
    ID_LIST       = "i",

    /**
     * Query key: `l`
     *
     * *Note!* Should be same as `EmailAuthQueryParam.LANGUAGE`
     */
    LANGUAGE      = "l"

}

export function isDashboardQueryParam (value: any): value is DashboardQueryParam {
    switch (value) {
        case DashboardQueryParam.ID_LIST:
        case DashboardQueryParam.LANGUAGE:
            return true;

        default:
            return false;

    }
}

export function stringifyDashboardQueryParam (value: DashboardQueryParam): string {
    switch (value) {
        case DashboardQueryParam.ID_LIST       : return 'ID_LIST';
        case DashboardQueryParam.LANGUAGE      : return 'LANGUAGE';
    }
    throw new TypeError(`Unsupported DashboardQueryParam value: ${value}`);
}

export function parseDashboardQueryParam (value: any): DashboardQueryParam | undefined {
    switch (`${value}`.toUpperCase()) {

        case 'I':
        case 'ID_LIST'       :
            return DashboardQueryParam.ID_LIST;

        case 'L'      :
        case 'LANGUAGE'      :
            return DashboardQueryParam.LANGUAGE;

        default    :
            return undefined;

    }
}


