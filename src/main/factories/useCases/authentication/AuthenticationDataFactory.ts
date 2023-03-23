import { AuthenticationData } from "@data/useCases/authentication/AuthenticationData";
import { BCryptAdapter } from "@infra/cryptography/bcrypt/BCryptAdapter";
import { AccountMongoDbRepository } from "@infra/database/mongoDb/repositories/account/AccountMongoDbRepository";
import { JwtAdapter } from "@infra/cryptography/jwt/JwtAdapter";
import env from "@main/config/env";
import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";

export class AuthenticationDataFactory {
	static authentication(): IAuthentication {
		const salt = 12;
		const bcryptAdapter = new BCryptAdapter(salt);
		const accountMongoDbRepository = new AccountMongoDbRepository();
		const jwtAdapter = new JwtAdapter(env.jwtSecret);

		return new AuthenticationData(
			accountMongoDbRepository,
			bcryptAdapter,
			jwtAdapter,
			accountMongoDbRepository
		);
	}
}