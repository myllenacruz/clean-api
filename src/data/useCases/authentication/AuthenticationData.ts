import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";
import { IAuthenticationParams } from "@domain/models/authentication/IAuthenticationParams";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";
import { IHashComparer } from "@data/protocols/cryptography/hash/IHashComparer";
import { IEncrypter } from "@data/protocols/cryptography/token/IEncrypter";
import { IUpdateAccessTokenRepository } from "@data/protocols/cryptography/token/IUpdateAccessTokenRepository";

export class AuthenticationData implements IAuthentication {
	private readonly loadAccountByUsernameRepository: ILoadAccountByUsernameRepository;
	private readonly hashComparer: IHashComparer;
	private readonly encrypter: IEncrypter;
	private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository;

	constructor(
		loadAccountByUsernameRepository: ILoadAccountByUsernameRepository,
		hashComparer: IHashComparer,
		encrypter: IEncrypter,
		updateAccessTokenRepository: IUpdateAccessTokenRepository
	) {
		this.loadAccountByUsernameRepository = loadAccountByUsernameRepository;
		this.hashComparer = hashComparer;
		this.encrypter = encrypter;
		this.updateAccessTokenRepository = updateAccessTokenRepository;
	}

	public async auth(authentication: IAuthenticationParams): Promise<string> {
		const account = await this.loadAccountByUsernameRepository.loadByUsername(authentication.username);

		if (account) {
			const isValid = await this.hashComparer.compare(authentication.password, account.password);

			if (isValid) {
				const accessToken = await this.encrypter.encrypt(account.id);

				await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);

				return accessToken;
			}
		}

		return "";
	}
}