import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";
import { IAuthenticationModel } from "@domain/models/authentication/IAuthenticationModel";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";
import { IHashComparer } from "@data/protocols/cryptography/hash/IHashComparer";
import { ITokenGenerator } from "@data/protocols/cryptography/token/ITokenGenerator";
import { IUpdateAccessTokenRepository } from "@data/protocols/cryptography/token/IUpdateAccessTokenRepository";

export class AuthenticationData implements IAuthentication {
	private readonly loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;
	private readonly hashComparer: IHashComparer;
	private readonly tokenGenerator: ITokenGenerator;
	private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository;

	constructor(
		loadAccountByUsernameRepository: ILoadAccountByUsernameRepository,
		hashComparer: IHashComparer,
		tokenGenerator: ITokenGenerator,
		updateAccessTokenRepository: IUpdateAccessTokenRepository
	) {
		this.loadAccountByUsernameRepository = loadAccountByUsernameRepository;
		this.hashComparer = hashComparer;
		this.tokenGenerator = tokenGenerator;
		this.updateAccessTokenRepository = updateAccessTokenRepository;
	}

	public async auth(authentication: IAuthenticationModel): Promise<string> {
		const account = await this.loadAccountByUsernameRepository.load(authentication.username);

		if (account) {
			const isValid = await this.hashComparer.compare(authentication.password, account.password);

			if (isValid) {
				const accessToken = await this.tokenGenerator.generate(account.id);

				await this.updateAccessTokenRepository.update(account.id, accessToken);

				return accessToken;
			}
		}

		return "";
	}
}