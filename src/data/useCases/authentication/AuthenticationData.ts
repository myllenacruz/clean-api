import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";
import { IAuthenticationModel } from "@domain/models/authentication/IAuthenticationModel";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";
import { IHashComparer } from "@data/protocols/cryptography/hash/IHashComparer";

export class AuthenticationData implements IAuthentication {
	private readonly loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;
	private readonly hashComparer: IHashComparer;

	constructor(
		loadAccountByUsernameRepository: ILoadAccountByUsernameRepository,
		hashComparer: IHashComparer
	) {
		this.loadAccountByUsernameRepository = loadAccountByUsernameRepository;
		this.hashComparer = hashComparer;
	}

	public async auth(authentication: IAuthenticationModel): Promise<string> {
		const account = await this.loadAccountByUsernameRepository.load(authentication.username);

		if (account)
			await this.hashComparer.compare(authentication.password, account.password);

		return "";
	}
}