import request from "supertest";
import app from "@main/config/app";
import { MongoHelper } from "@infra/database/mongoDb/helpers/MongoHelper";
import { Collection } from "mongodb";
import { hash } from "bcrypt";

let accountCollection: Collection;

describe("LoginRoute", () => {
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

	test("Should return 200 on login", async () => {
		const password = await hash("1234", 12);

		await accountCollection.insertOne({
			username: "janeDoe",
			email: "janedoe@email.com",
			password
		});

		await request(app)
			.post("/api/login")
			.send({
				username: "janeDoe",
				password: "1234"
			})
			.expect(200);
	});
});