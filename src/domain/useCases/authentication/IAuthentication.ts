import { IAuthenticationParams } from "@domain/models/authentication/IAuthenticationParams";

export interface IAuthentication {
	auth(authentication: IAuthenticationParams): Promise<string>;
}