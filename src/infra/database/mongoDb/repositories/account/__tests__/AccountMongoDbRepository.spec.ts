import { MongoHelper } from "@infra/database/mongoDb/helpers/MongoHelper";
import { AccountMongoDbRepository } from "@infra/database/mongoDb/account/AccountMongoDbRepository";

describe("AccountMongoDbRepository", () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL!);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		const accountCollection = MongoHelper.getCollection("accounts");
		await accountCollection.deleteMany({});
	});

	test("Should return an account on success", async () => {
		const systemUnderTest = new AccountMongoDbRepository();
		const account = await systemUnderTest.handle({
			username: "janeDoe",
			email: "valid@email.com",
			password: "1234"
		});

		expect(account).toBeTruthy();
		expect(account.id).toBeTruthy();
		expect(account.username).toBe("janeDoe");
		expect(account.email).toBe("valid@email.com");
		expect(account.password).toBe("1234");
	});
});