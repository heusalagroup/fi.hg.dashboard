// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { first, toUpper, trim } from "../../core/modules/lodash";
import { User } from "../types/User";

export class UserUtils {

    public static getInitials (
        name  ?: string | undefined,
        email ?: string | undefined
    ) : string {
        const names : string[] = trim((name ? name : undefined) ?? (email ? email : undefined) ?? '').replace(/@.*$/, "").split(/ +/).map(trim);
        const firstLetter : string = first(names.shift() ?? '') ?? '.';
        const lastLetter  : string = first(names.pop()   ?? '') ?? '.';
        return toUpper(firstLetter + lastLetter);
    }

    public static getUserInitials (
        user: User
    ) : string {
        return UserUtils.getInitials(user?.name, user?.email);
    }

}
