import { IAuthenticationModel } from "@domain/useCases/authentication/IAuthenticationModel";

export interface IAuthentication {
	auth(authentication: IAuthenticationModel): Promise<string>;
}