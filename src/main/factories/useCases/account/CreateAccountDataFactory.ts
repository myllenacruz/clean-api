import { AuthenticationData } from "@data/useCases/authentication/AuthenticationData";
import { BCryptAdapter } from "@infra/cryptography/bcrypt/BCryptAdapter";
import { AccountMongoDbRepository } from "@infra/database/mongoDb/repositories/account/AccountMongoDbRepository";
import { ICreateAccount } from "@domain/useCases/account/ICreateAccount";
import { CreateAccountData } from "@data/useCases/account/CreateAccountData";

export class CreateAccountDataFactory {
	static handle(): ICreateAccount {
		const salt = 12;
		const bcryptAdapter = new BCryptAdapter(salt);
		const accountMongoDbRepository = new AccountMongoDbRepository();

		return new CreateAccountData(bcryptAdapter, accountMongoDbRepository, accountMongoDbRepository);
	}
}