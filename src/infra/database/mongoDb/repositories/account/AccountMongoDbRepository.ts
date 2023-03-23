import { ICreateAccountRepository } from "@data/protocols/account/ICreateAccountRepository";
import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccountParams } from "@domain/models/account/ICreateAccountParams";
import { MongoHelper } from "@infra/database/mongoDb/helpers/MongoHelper";
import { ILoadAccountByUsernameRepository } from "@data/protocols/account/ILoadAccountByUsernameRepository";
import { IUpdateAccessTokenRepository } from "@data/protocols/cryptography/token/IUpdateAccessTokenRepository";
import { ObjectId } from "mongodb";

export class AccountMongoDbRepository implements
	ICreateAccountRepository,
	ILoadAccountByUsernameRepository,
	IUpdateAccessTokenRepository
{
	public async create(accountData: ICreateAccountParams): Promise<IAccountModel> {
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

	public async updateAccessToken(
		id: string,
		token: string
	): Promise<void> {
		const accountCollection = MongoHelper.getCollection("accounts");

		await accountCollection.updateOne({
			_id: new ObjectId(id)
		}, {
			$set: {
				accessToken: token
			}
		});
	}
}