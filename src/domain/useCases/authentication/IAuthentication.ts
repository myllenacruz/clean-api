import { IAuthenticationModel } from "@domain/models/authentication/IAuthenticationModel";

export interface IAuthentication {
	auth(authentication: IAuthenticationModel): Promise<string>;
}