import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";
import { IAuthenticationModel } from "@domain/models/authentication/IAuthenticationModel";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";

export class AuthenticationData implements IAuthentication {
	private readonly loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;

	constructor(loadAccountByUsernameRepository: ILoadAccountByUsernameRepository) {
		this.loadAccountByUsernameRepository = loadAccountByUsernameRepository;
	}

	public async auth(authentication: IAuthenticationModel): Promise<string> {
		await this.loadAccountByUsernameRepository.load(authentication.username);
		return "";
	}
}