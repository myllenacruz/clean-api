import { SignUpController } from "@presentation/controllers/signUp/SignUpController";
import { EmailValidatorAdapter } from "@utils/email/EmailValidatorAdapter";
import { BCryptAdapter } from "@infra/cryptography/bcrypt/BCryptAdapter";
import { AccountMongoDbRepository } from "@infra/database/mongoDb/repositories/account/AccountMongoDbRepository";
import { CreateAccountData } from "@data/useCases/account/CreateAccountData";
import { LogControllerDecorator } from "@main/decorators/log/LogControllerDecorator";
import { IController } from "@presentation/protocols/controllers/IController";

export class SignUpFactory {
	static controller(): IController {
		const salt = 12;
		const emailValidatorAdapter = new EmailValidatorAdapter();
		const bcryptAdapter = new BCryptAdapter(salt);
		const accountMongoDbRepository = new AccountMongoDbRepository();
		const accountData = new CreateAccountData(bcryptAdapter, accountMongoDbRepository);
		const signUpController = new SignUpController(emailValidatorAdapter, accountData);

		return new LogControllerDecorator(signUpController);
	}
}