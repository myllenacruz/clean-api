import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";
import { IAuthenticationModel } from "@domain/models/authentication/IAuthenticationModel";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";
import { IHashComparer } from "@data/protocols/cryptography/hash/IHashComparer";
import { ITokenGenerator } from "@data/protocols/cryptography/token/ITokenGenerator";

export class AuthenticationData implements IAuthentication {
	private readonly loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;
	private readonly hashComparer: IHashComparer;
	private readonly tokenGenerator: ITokenGenerator;

	constructor(
		loadAccountByUsernameRepository: ILoadAccountByUsernameRepository,
		hashComparer: IHashComparer,
		tokenGenerator: ITokenGenerator
	) {
		this.loadAccountByUsernameRepository = loadAccountByUsernameRepository;
		this.hashComparer = hashComparer;
		this.tokenGenerator = tokenGenerator;
	}

	public async auth(authentication: IAuthenticationModel): Promise<string> {
		const account = await this.loadAccountByUsernameRepository.load(authentication.username);

		if (account) {
			await this.hashComparer.compare(authentication.password, account.password);
			await this.tokenGenerator.generate(account.id);
		}

		return "";
	}
}