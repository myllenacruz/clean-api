import { MongoHelper } from "@infra/database/mongoDb/helpers/MongoHelper";
import { Collection } from "mongodb";
import { LogMongoDbRepository } from "@infra/database/mongoDb/logRepository/LogMongoDbRepository";

describe("LogMongoDbRepository", () => {
	let errorCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL!);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		errorCollection = MongoHelper.getCollection("errors");
		await errorCollection.deleteMany({});
	});

	test("Should create an error log on success", async () => {
		const systemUnderTest = new LogMongoDbRepository();
		await systemUnderTest.logError("anyError");
		const count = await errorCollection.countDocuments();

		expect(count).toBe(1);
	});
});