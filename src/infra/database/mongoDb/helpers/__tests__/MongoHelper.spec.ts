import { MongoHelper as systemUnderTest } from "@infra/database/mongoDb/helpers/MongoHelper";

describe("MongoHelper", () => {
	beforeAll(async () => {
		await systemUnderTest.connect(process.env.MONGO_URL!);
	});

	afterAll(async () => {
		await systemUnderTest.disconnect();
	});

	test("Should reconnect if mongoDb is down", async () => {
		let accountCollection = systemUnderTest.getCollection("accounts");

		expect(accountCollection).toBeTruthy();

		await systemUnderTest.disconnect();

		accountCollection = systemUnderTest.getCollection("accounts");

		expect(accountCollection).toBeTruthy();
	});
});