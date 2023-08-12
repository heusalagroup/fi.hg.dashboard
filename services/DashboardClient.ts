// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../../core/LogService";
import { LogLevel } from "../../core/types/LogLevel";
import { HttpService } from "../../core/HttpService";
import { EmailTokenDTO, isEmailTokenDTO } from "../../core/auth/email/types/EmailTokenDTO";
import { IndexDTO, isIndexDTO } from "../types/dto/IndexDTO";
import { DASHBOARD_API_AUTHENTICATE_EMAIL_PATH, DASHBOARD_API_DELETE_MY_WORKSPACE_LIST_PATH, DASHBOARD_API_GET_MY_PROFILE_PATH, DASHBOARD_API_GET_MY_WORKSPACE_LIST_PATH, DASHBOARD_API_INDEX_PATH, DASHBOARD_API_POST_MY_WORKSPACE_PATH, DASHBOARD_API_VERIFY_EMAIL_CODE_PATH, DASHBOARD_API_VERIFY_EMAIL_TOKEN_PATH, createNewWorkspaceUserPath, getDashboardMyUserListPath, getWorkspaceUserPath, updateWorkspaceUserPath } from "../constants/dashboard-api";
import { isProfileDTO, ProfileDTO } from "../types/dto/ProfileDTO";
import { DASHBOARD_AUTHORIZATION_HEADER_NAME } from "../constants/dashboard-headers";
import { DashboardQueryParam } from "../types/DashboardQueryParam";
import { createAuthenticateEmailDTO } from "../../core/auth/email/types/AuthenticateEmailDTO";
import { ReadonlyJsonAny } from "../../core/Json";
import { createVerifyEmailTokenDTO } from "../../core/auth/email/types/VerifyEmailTokenDTO";
import { createVerifyEmailCodeDTO } from "../../core/auth/email/types/VerifyEmailCodeDTO";
import { isNewWorkspaceDTO, NewWorkspaceDTO } from "../types/dto/NewWorkspaceDTO";
import { Workspace } from "../types/Workspace";
import { isWorkspaceListDTO } from "../types/dto/WorkspaceListDTO";
import { isUser, User } from "../types/User";
import { isUserListDTO } from "../types/dto/UserListDTO";

const LOG = LogService.createLogger('DashboardClient');

export class DashboardClient {

    public static setLogLevel (level: LogLevel) {
        LOG.setLogLevel(level);
        HttpService.setLogLevel(level);
    }

    private static _defaultUrl : string = '/api';

    private readonly _url : string;

    private _sessionToken : EmailTokenDTO | undefined;
    private _workspaceId  : string | undefined;

    public static setDefaultUrl (url : string) {
        this._defaultUrl = url;
    }

    public static getDefaultUrl () : string {
        return this._defaultUrl;
    }

    public static create (
        url : string = DashboardClient._defaultUrl
    ) : DashboardClient {
        return new DashboardClient(url);
    }

    public constructor (
        url : string = DashboardClient._defaultUrl
    ) {
        this._url = url;
        this._sessionToken = undefined;
    }

    public getUrl () : string {
        return this._url;
    }

    /**
     * Returns current selected workspace
     */
    public getWorkspaceId () : string | undefined {
        return this._workspaceId;
    }

    /**
     * Sets current selected workspace
     */
    public setWorkspaceId (
        workspaceId : string | undefined
    ) {
        this._workspaceId = workspaceId;
    }

    /**
     * Returns the session token object
     */
    public getSessionToken () : EmailTokenDTO | undefined {
        return this._sessionToken;
    }

    /**
     * Returns true if the session is verified
     */
    public hasVerifiedSession () : boolean {
        return this._sessionToken?.verified ?? false;
    }

    /**
     * Returns the email address saved in the session.
     *
     * Note! This might not be verified.
     */
    public getEmailAddress () : string | undefined {
        return this._sessionToken?.email;
    }

    /**
     * Returns the verified email address in the session
     */
    public getVerifiedEmailAddress () : string | undefined {
        return this.hasVerifiedSession() ? this.getEmailAddress() : undefined;
    }

    /**
     * Set or unset the session token object
     *
     * @param token
     */
    public setSessionToken (token: EmailTokenDTO | undefined) {
        this._sessionToken = token;
    }


    /**
     * Returns service root resource
     */
    public async getIndex () : Promise<IndexDTO> {
        const result = await HttpService.getJson(`${this._url}${DASHBOARD_API_INDEX_PATH}`);
        if (!isIndexDTO(result)) {
            LOG.debug(`getIndex: result = `, result);
            throw new TypeError(`getIndex: Result was not IndexDTO: ` + result);
        }
        return result;
    }


    /**
     * Returns user profile
     */
    public async getMyProfile () : Promise<ProfileDTO> {

        const token = this._sessionToken?.token;
        if (!token) throw new TypeError(`getMyProfile: You must login first`);
        const result = await HttpService.getJson(
            `${this._url}${DASHBOARD_API_GET_MY_PROFILE_PATH}`,
            {
                [DASHBOARD_AUTHORIZATION_HEADER_NAME]: token
            }
        );
        if (!isProfileDTO(result)) {
            LOG.debug(`getMyProfile: result = `, result);
            throw new TypeError(`getMyProfile: Result was not ProfileDTO: ` + result);
        }
        return result;
    }


    /**
     * Authenticate a session using an email message sent to the email address
     * with a secret code number.
     *
     * This call will not save the token automatically. See `.loginUsingEmail()`
     * for that functionality.
     *
     * @param email The email address to use for validation
     * @param langString The language for the email message
     */
    public async authenticateUsingEmail (
        email        : string,
        langString   : string | undefined = undefined
    ) : Promise<EmailTokenDTO> {
        const queryParams : string = langString ? `?${DashboardQueryParam.LANGUAGE}=${encodeURIComponent(langString)}` : '';
        const result = await HttpService.postJson(
            `${this._url}${DASHBOARD_API_AUTHENTICATE_EMAIL_PATH}${queryParams}`,
            createAuthenticateEmailDTO(email) as unknown as ReadonlyJsonAny
        );
        if (!isEmailTokenDTO(result)) {
            LOG.debug(`authenticateEmail: result = `, result);
            throw new TypeError(`Result was not EmailTokenDTO: ` + result);
        }
        return result;
    }

    /**
     * Verifies existing email token validity using the backend
     *
     * @param token The token to verify using a request to the backend
     */
    public async verifyEmailToken (
        token : EmailTokenDTO
    ) : Promise<EmailTokenDTO> {
        const result = await HttpService.postJson(
            `${this._url}${DASHBOARD_API_VERIFY_EMAIL_TOKEN_PATH}`,
            createVerifyEmailTokenDTO(token) as unknown as ReadonlyJsonAny
        );
        if (!isEmailTokenDTO(result)) {
            LOG.debug(`authenticateEmail: result = `, result);
            throw new TypeError(`Result was not EmailTokenDTO: ` + result);
        }
        return result;
    }

    /**
     *
     * @param token The token from the request `.authenticateUsingEmail()`
     * @param code The code from the received email message
     */
    public async verifyEmailCode (
        token       : EmailTokenDTO,
        code        : string
    ) : Promise<EmailTokenDTO> {
        const result = await HttpService.postJson(
            `${this._url}${DASHBOARD_API_VERIFY_EMAIL_CODE_PATH}`,
            createVerifyEmailCodeDTO(token, code) as unknown as ReadonlyJsonAny
        );
        if (!isEmailTokenDTO(result)) {
            LOG.debug(`authenticateEmail: result = `, result);
            throw new TypeError(`Result was not EmailTokenDTO: ` + result);
        }
        return result;
    }

    /**
     * Authenticate a session using an email message sent to the email address
     * with a secret code number.
     *
     * See also `.verifySessionWithCode()`
     *
     * @param email
     */
    public async loginUsingEmail (email : string) {
        const token = await this.authenticateUsingEmail(email);
        this.setSessionToken(token);
    }

    /**
     * Verify saved session with a code
     *
     * @param code
     */
    public async verifySessionWithCode (
        code : string
    ) {
        const token = this.getSessionToken();
        if (!token) throw new TypeError(`No session! You must call login first`);
        const result = await this.verifyEmailCode( token, code );
        this.setSessionToken(result);
    }

    /**
     * Validate saved session token
     */
    public async refreshSession () {
        const token = this.getSessionToken();
        if (!token) throw new TypeError(`No session! You must call login first`);
        const result = await this.verifyEmailToken( token );
        this.setSessionToken(result);
    }


    // ******************* WORKSPACES *******************

    /**
     * Create a workspace and return full resources from the backend
     *
     * @param name
     * @param categories
     */
    public async createWorkspaceWithResources (
        name: string
    ) : Promise<NewWorkspaceDTO> {
        const token = this._sessionToken?.token;
        if (!token) throw new TypeError(`createWorkspace: You must login first`);
        const result = await HttpService.postJson(
            `${this._url}${DASHBOARD_API_POST_MY_WORKSPACE_PATH}`,
            {
                id: 'new',
                name
            },
            {
                [DASHBOARD_AUTHORIZATION_HEADER_NAME]: token
            }
        );
        if (!isNewWorkspaceDTO(result)) {
            LOG.debug(`createWorkspace: result = `, result);
            throw new TypeError(`Result was not NewWorkspaceDTO: ` + result);
        }
        return result;
    }

    /**
     * Create a workspace and return the workspace only
     *
     * @param name
     * @param categories
     */
    public async createWorkspace (
        name: string
    ) : Promise<Workspace> {
        const dto = await this.createWorkspaceWithResources(name);
        return dto.payload;
    }



    /**
     * Update a workspace at the backend
     *
     * @param workspaceId
     * @param changes
     */
    public async updateWorkspace (
        // @ts-ignore
        workspaceId: string,
        // @ts-ignore
        changes: Partial<Workspace>
    ) : Promise<Workspace> {
        throw new Error('Workspace update not implemented yet');
        // const token = this._sessionToken?.token;
        // if (!token) throw new TypeError(`updateWorkspace: You must login first`);
        // const result = await HttpService.postJson(
        //     `${this._url}${getDashboardWorkspaceUpdatePath(workspaceId)}`,
        //     changes,
        //     {
        //         [DASHBOARD_AUTHORIZATION_HEADER_NAME]: token
        //     }
        // );
        // if (!isUser(result)) {
        //     LOG.debug(`updateMyUser: result = `, result);
        //     throw new TypeError(`updateMyUser: Result was not User: ` + result);
        // }
        // return result;
    }

    /**
     * Delete all workspaces
     *
     */
    public async deleteWorkspaces () : Promise<void> {
        const token = this._sessionToken?.token;
        if (!token) throw new TypeError(`deleteWorkspaces: You must login first`);
        await HttpService.deleteJson(
            `${this._url}${DASHBOARD_API_DELETE_MY_WORKSPACE_LIST_PATH}`,
            {
                [DASHBOARD_AUTHORIZATION_HEADER_NAME]: token
            }
        );
    }

    /**
     * Fetch list of workspaces from the backend
     *
     * @param idList
     */
    public async getMyWorkspaceList (
        // @ts-ignore
        idList: string[] = []
    ) : Promise<readonly Workspace[]> {
        const token = this._sessionToken?.token;
        if (!token) throw new TypeError(`getMyWorkspaceList: You must login first`);
        const result = await HttpService.getJson(
            `${this._url}${DASHBOARD_API_GET_MY_WORKSPACE_LIST_PATH}`,
            {
                [DASHBOARD_AUTHORIZATION_HEADER_NAME]: token
            }
        );
        if (!isWorkspaceListDTO(result)) {
            LOG.debug(`getWorkspaceList: result = `, result);
            throw new TypeError(`Result was not WorkspaceListDTO: ` + result);
        }
        return result?.payload;
    }

    // ******************* USERS *******************

    /**
     * Create a new user in a workspace
     *
     * @param item The user data. Property id will be ignored and new one assigned.
     */
    public async createWorkspaceUser (
        item: User
    ) : Promise<User> {
        const workspaceId = item.workspaceId;
        const token = this._sessionToken?.token;
        if (!token) throw new TypeError(`createUser: You must login first`);
        const result = await HttpService.postJson(
            `${this._url}${createNewWorkspaceUserPath(workspaceId)}`,
            item as unknown as ReadonlyJsonAny,
            {
                [DASHBOARD_AUTHORIZATION_HEADER_NAME]: token
            }
        );
        if (!isUser(result)) {
            LOG.debug(`createUser: result = `, result);
            throw new TypeError(`Result was not User: ` + result);
        }
        return result;
    }

    /**
     * Fetch list of users from the backend for this workspace
     *
     * @param workspaceId
     * @param userIdList
     */
    public async getWorkspaceUserList (
        workspaceId: string,
        // @ts-ignore
        userIdList: string[] = []
    ) : Promise<readonly User[]> {
        const token = this._sessionToken?.token;
        if (!token) throw new TypeError(`getMyUserList: You must login first`);
        const result = await HttpService.getJson(
            `${this._url}${getDashboardMyUserListPath(workspaceId)}`,
            {
                [DASHBOARD_AUTHORIZATION_HEADER_NAME]: token
            }
        );
        if (!isUserListDTO(result)) {
            LOG.debug(`getMyUserList: result = `, result);
            throw new TypeError(`Result was not UserListDTO: ` + result);
        }
        return result?.payload;
    }

    /**
     * Fetch a user from the backend for this workspace
     *
     * @param workspaceId
     * @param userId
     */
    public async getWorkspaceUser (
        workspaceId: string,
        userId: string
    ) : Promise<User> {
        const token = this._sessionToken?.token;
        if (!token) throw new TypeError(`getMyUser: You must login first`);
        const result = await HttpService.getJson(
            `${this._url}${getWorkspaceUserPath(workspaceId, userId)}`,
            {
                [DASHBOARD_AUTHORIZATION_HEADER_NAME]: token
            }
        );
        if (!isUser(result)) {
            LOG.debug(`getMyUser: result = `, result);
            throw new TypeError(`Result was not User: ` + result);
        }
        return result;
    }

    /**
     * Update a user at the backend for this workspace
     *
     * @param workspaceId
     * @param userId
     * @param changes
     */
    public async updateWorkspaceUser (
        workspaceId: string,
        userId: string,
        changes: Partial<User>
    ) : Promise<User> {
        const token = this._sessionToken?.token;
        if (!token) throw new TypeError(`updateMyUser: You must login first`);
        const result = await HttpService.postJson(
            `${this._url}${updateWorkspaceUserPath(workspaceId, userId)}`,
            changes,
            {
                [DASHBOARD_AUTHORIZATION_HEADER_NAME]: token
            }
        );
        if (!isUser(result)) {
            LOG.debug(`updateMyUser: result = `, result);
            throw new TypeError(`updateMyUser: Result was not User: ` + result);
        }
        return result;
    }

}
