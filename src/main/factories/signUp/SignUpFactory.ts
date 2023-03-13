import { SignUpController } from "@presentation/controllers/signUp/SignUpController";
import { BCryptAdapter } from "@infra/cryptography/bcrypt/BCryptAdapter";
import { AccountMongoDbRepository } from "@infra/database/mongoDb/repositories/account/AccountMongoDbRepository";
import { CreateAccountData } from "@data/useCases/account/CreateAccountData";
import { LogControllerDecorator } from "@main/decorators/log/LogControllerDecorator";
import { IController } from "@presentation/protocols/controllers/IController";
import { LogMongoDbRepository } from "@infra/database/mongoDb/repositories/log/LogMongoDbRepository";
import { SignUpValidationFactory } from "@main/factories/signUp/SignUpValidationFactory";

export class SignUpFactory {
	static controller(): IController {
		const salt = 12;
		const bcryptAdapter = new BCryptAdapter(salt);
		const accountMongoDbRepository = new AccountMongoDbRepository();
		const accountData = new CreateAccountData(bcryptAdapter, accountMongoDbRepository);
		const signUpController = new SignUpController(
			accountData,
			SignUpValidationFactory.validate()
		);
		const logMongoDbRepository = new LogMongoDbRepository();

		return new LogControllerDecorator(signUpController, logMongoDbRepository);
	}
}