import { ILogErrorRepository } from "@data/protocols/log/ILogErrorRepository";
import { MongoHelper } from "@infra/database/mongoDb/helpers/MongoHelper";

export class LogMongoDbRepository implements ILogErrorRepository {
	public async logError(stack: string): Promise<void> {
		const errorCollection = await MongoHelper.getCollection("errors");

		await errorCollection.insertOne({
			stack,
			date: new Date()
		});
	}
}