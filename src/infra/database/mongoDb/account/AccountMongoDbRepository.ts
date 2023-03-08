import { ICreateAccountRepository } from "@data/protocols/account/ICreateAccountRepository";
import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccountModel } from "@domain/useCases/account/ICreateAccountModel";
import { MongoHelper } from "@infra/database/mongoDb/helpers/MongoHelper";

export class AccountMongoDbRepository implements ICreateAccountRepository {
	public async handle(accountData: ICreateAccountModel): Promise<IAccountModel> {
		const accountCollection = MongoHelper.getCollection("accounts");

		const newAccount = await accountCollection.insertOne(accountData);

		const account = await accountCollection.findOne({
			_id: newAccount.insertedId
		});

		return MongoHelper.mapper(account!);
	}
}