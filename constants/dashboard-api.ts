// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Language } from "../../core/types/Language";
import { AuthEmailQueryParam } from "../../core/auth/email/types/AuthEmailQueryParam";
import { CallbackWithLanguage } from "../../core/auth/email/constants";

export const VALID_ADMIN_DOMAINS = ['example.fi', 'example.com'];

/**
 * `GET /`
 */
export const DASHBOARD_API_INDEX_PATH = '/';


// *************** AUTHENTICATIONS *************** //

/**
 * `POST /authenticate`
 */
export const DASHBOARD_API_AUTHENTICATE_EMAIL_PATH = '/authenticate';

/**
 * `POST /authenticate/verify-token`
 */
export const DASHBOARD_API_VERIFY_EMAIL_TOKEN_PATH = '/authenticate/verify-token';

/**
 * `POST /authenticate/verify-code`
 */
export const DASHBOARD_API_VERIFY_EMAIL_CODE_PATH = '/authenticate/verify-code';

export const DASHBOARD_AUTHENTICATE_EMAIL_URL_WITH_LANGUAGE : CallbackWithLanguage = (lang: Language) => `${DASHBOARD_API_AUTHENTICATE_EMAIL_PATH}?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;
export const DASHBOARD_VERIFY_EMAIL_CODE_URL_WITH_LANGUAGE  : CallbackWithLanguage = (lang: Language) => `${DASHBOARD_API_VERIFY_EMAIL_CODE_PATH}?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;
export const DASHBOARD_VERIFY_EMAIL_TOKEN_URL_WITH_LANGUAGE : CallbackWithLanguage = (lang: Language) => `${DASHBOARD_API_VERIFY_EMAIL_TOKEN_PATH}?${AuthEmailQueryParam.LANGUAGE}=${q(lang)}`;

// *************** WORKSPACES *************** //

/**
 * `GET /my/workspaces`
 */
export const DASHBOARD_API_GET_MY_WORKSPACE_LIST_PATH = "/my/workspaces";


/**
 * `DELETE /my/workspaces`
 */
export const DASHBOARD_API_DELETE_MY_WORKSPACE_LIST_PATH = "/my/workspaces";


/**
 * Create a workspace
 *
 * `POST /my/workspaces`
 */
export const DASHBOARD_API_POST_MY_WORKSPACE_PATH = "/my/workspaces";


// *************** PROFILE *************** //

/**
 * `GET /my/profile`
 */
export const DASHBOARD_API_GET_MY_PROFILE_PATH = "/my/profile";


// *************** USERS *************** //

/**
 * `GET /my/workspaces/{parentId}/users`
 */
export const DASHBOARD_API_GET_MY_WORKSPACE_USER_LIST_PATH = "/my/workspaces/{parentId}/users";

/**
 * return workspace to this emails
 * `GET /my/workspaces/{parentId}/profile`
 */
export const DASHBOARD_API_GET_MY_WORKSPACE_USER_BY_PROFILE_PATH = "/my/workspaces/{parentId}/profile";

/**
 * `GET /my/workspaces/{parentId}/users`
 */
export const getDashboardMyUserListPath = (parentId: string) => `/my/workspaces/${encodeURIComponent(parentId)}/users`;

/**
 * `parentId`
 */
export const DASHBOARD_API_GET_MY_WORKSPACE_USER_LIST_WORKSPACE_ID = "parentId";


/**
 * Create a new user end point
 *
 * `POST /my/workspaces/{parentId}/users`
 */
export const DASHBOARD_API_POST_MY_WORKSPACE_USER_PATH = '/my/workspaces/{parentId}/users';

/**
 * Create a new user end point
 *
 * `POST /my/workspaces/{parentId}/users`
 */
export const createNewWorkspaceUserPath = (parentId: string) => `/my/workspaces/${encodeURIComponent(parentId)}/users`;

/**
 * `parentId`
 */
export const DASHBOARD_API_POST_MY_WORKSPACE_USER_WORKSPACE_ID = "parentId";


/**
 * `GET /my/workspaces/{parentId}/users/{id}`
 */
export const DASHBOARD_API_GET_MY_WORKSPACE_USER_PATH = "/my/workspaces/{parentId}/users/{id}";

/**
 * Get path to user end point
 *
 * `GET /my/workspaces/{parentId}/users`
 */
export const getWorkspaceUserPath = (parentId: string, id: string) => `/my/workspaces/${encodeURIComponent(parentId)}/users/${encodeURIComponent(id)}`;

/**
 * `parentId`
 */
export const DASHBOARD_API_GET_MY_WORKSPACE_USER_WORKSPACE_ID = "parentId";

/**
 * `id`
 */
export const DASHBOARD_API_GET_MY_WORKSPACE_USER_USER_ID = "id";


/**
 * `POST /my/workspaces/{parentId}/users/{id}`
 */
export const DASHBOARD_API_UPDATE_MY_WORKSPACE_USER_PATH = "/my/workspaces/{parentId}/users/{id}";

/**
 * POST path to user end point
 *
 * `POST /my/workspaces/{parentId}/users/{userId}`
 */
export const updateWorkspaceUserPath = (parentId: string, id: string) => `/my/workspaces/${encodeURIComponent(parentId)}/users/${encodeURIComponent(id)}`;

/**
 * Workspace ID parameter
 *
 * `parentId`
 */
export const DASHBOARD_API_UPDATE_MY_WORKSPACE_USER_WORKSPACE_ID = "parentId";

/**
 * User ID parameter
 *
 * `id`
 */
export const DASHBOARD_API_UPDATE_MY_WORKSPACE_USER_USER_ID = "id";

function q (value: string) : string {
    return encodeURIComponent(value);
}
