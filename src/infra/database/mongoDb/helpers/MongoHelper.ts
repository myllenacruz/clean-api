import { MongoClient, Collection, WithId, Document } from "mongodb";
import { IAccountModel } from "@domain/models/account/interfaces/IAccountModel";

export class MongoHelper {
	static client: MongoClient;

	static async connect(uri: string): Promise<void> {
		this.client = await MongoClient.connect(uri);
	}

	static async disconnect(): Promise<void> {
		await this.client.close();
	}

	static getCollection(name: string): Collection {
		return this.client.db().collection(name);
	}

	static mapper(collection: WithId<Document>): IAccountModel {
		const {
			_id,
			...accountWithoutId
		} = collection;

		return Object.assign({},
			accountWithoutId,
			{ id: _id.toHexString() }
		) as IAccountModel;
	}
}