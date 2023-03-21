import { AuthenticationData } from "@data/useCases/authentication/AuthenticationData";
import { BCryptAdapter } from "@infra/cryptography/bcrypt/BCryptAdapter";
import { AccountMongoDbRepository } from "@infra/database/mongoDb/repositories/account/AccountMongoDbRepository";
import { IController } from "@presentation/protocols/controllers/IController";
import { JwtAdapter } from "@infra/cryptography/jwt/JwtAdapter";
import { LoginController } from "@presentation/controllers/login/LoginController";
import { LoginValidationFactory } from "./LoginValidationFactory";
import { LogMongoDbRepository } from "@infra/database/mongoDb/repositories/log/LogMongoDbRepository";
import { LogControllerDecorator } from "@main/decorators/log/LogControllerDecorator";
import env from "@main/config/env";

export class LoginFactory {
	static login(): IController {
		const salt = 12;
		const bcryptAdapter = new BCryptAdapter(salt);
		const accountMongoDbRepository = new AccountMongoDbRepository();
		const jwtAdapter = new JwtAdapter(env.jwtSecret);
		const authenticationData = new AuthenticationData(
			accountMongoDbRepository,
			bcryptAdapter,
			jwtAdapter,
			accountMongoDbRepository
		);
		const loginController = new LoginController(
			authenticationData,
			LoginValidationFactory.validate()
		);
		const logMongoDbRepository = new LogMongoDbRepository();

		return new LogControllerDecorator(loginController, logMongoDbRepository);
	}
}