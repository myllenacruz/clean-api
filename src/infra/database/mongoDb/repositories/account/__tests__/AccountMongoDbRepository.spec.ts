import { MongoHelper } from "@infra/database/mongoDb/helpers/MongoHelper";
import { AccountMongoDbRepository } from "@infra/database/mongoDb/repositories/account/AccountMongoDbRepository";
import { Collection } from "mongodb";

let accountCollection: Collection;

describe("AccountMongoDbRepository", () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL!);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		accountCollection = MongoHelper.getCollection("accounts");
		await accountCollection.deleteMany({});
	});

	test("Should return an account on add success", async () => {
		const systemUnderTest = new AccountMongoDbRepository();
		const account = await systemUnderTest.create({
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

	test("Should return an account on loadByUsername success", async () => {
		const systemUnderTest = new AccountMongoDbRepository();

		await accountCollection.insertOne({
			username: "janeDoe",
			email: "valid@email.com",
			password: "1234"
		});

		const account = await systemUnderTest.loadByUsername("janeDoe");

		expect(account).toBeTruthy();
		expect(account!.id).toBeTruthy();
		expect(account!.username).toBe("janeDoe");
		expect(account!.email).toBe("valid@email.com");
		expect(account!.password).toBe("1234");
	});

	test("Should undefined if loadByUsername fails", async () => {
		const systemUnderTest = new AccountMongoDbRepository();
		const account = await systemUnderTest.loadByUsername("janeDoe");

		expect(account).toBeFalsy();
	});

	test("Should update the account accessToken on UpdateAccessToken success", async () => {
		const systemUnderTest = new AccountMongoDbRepository();

		const account = await accountCollection.insertOne({
			username: "janeDoe",
			email: "valid@email.com",
			password: "1234"
		});

		await systemUnderTest.updateAccessToken(account.insertedId.toHexString(), "validToken");

		const accountFounded = await accountCollection.findOne({
			_id: account.insertedId
		});

		expect(accountFounded).toBeTruthy();
		expect(accountFounded!.accessToken).toBe("validToken");
	});
});