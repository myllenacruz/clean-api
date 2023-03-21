import { ICreateAccountRepository } from "@data/protocols/account/ICreateAccountRepository";
import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccountModel } from "@domain/models/account/ICreateAccountModel";
import { MongoHelper } from "@infra/database/mongoDb/helpers/MongoHelper";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";

export class AccountMongoDbRepository implements ICreateAccountRepository, ILoadAccountByUsernameRepository {
	public async create(accountData: ICreateAccountModel): Promise<IAccountModel> {
		const accountCollection = MongoHelper.getCollection("accounts");

		const newAccount = await accountCollection.insertOne(accountData);

		const account = await accountCollection.findOne({
			_id: newAccount.insertedId
		});

		return MongoHelper.mapper(account!);
	}

	public async loadByUsername(username: string): Promise<IAccountModel | undefined> {
		const accountCollection = MongoHelper.getCollection("accounts");
		const account = await accountCollection.findOne({ username });

		if (account)
			return MongoHelper.mapper(account);
	}
}