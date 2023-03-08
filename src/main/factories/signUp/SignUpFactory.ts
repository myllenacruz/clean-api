import { SignUpController } from "@presentation/controllers/signUp/SignUpController";
import { EmailValidatorAdapter } from "@utils/email/EmailValidatorAdapter";
import { BCryptAdapter } from "@infra/cryptography/bcrypt/BCryptAdapter";
import { AccountMongoDbRepository } from "@infra/database/mongoDb/account/AccountMongoDbRepository";
import { CreateAccountData } from "@data/useCases/account/CreateAccountData";

export class SignUpFactory {
	static controller(): SignUpController {
		const salt = 12;
		const emailValidatorAdapter = new EmailValidatorAdapter();
		const bcryptAdapter = new BCryptAdapter(salt);
		const accountMongoDbRepository = new AccountMongoDbRepository();
		const accountData = new CreateAccountData(bcryptAdapter, accountMongoDbRepository);

		return new SignUpController(emailValidatorAdapter, accountData);
	}
}