import request from "supertest";
import app from "@main/config/app";
import { MongoHelper } from "@infra/database/mongoDb/helpers/MongoHelper";
import { InvalidParamError } from "@presentation/errors/InvalidParamError";

describe("SignUpRoutes", () => {
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
		await request(app)
			.post("/api/signup")
			.send({
				username: "janeDoe",
				email: "janedoe@email.com",
				password: "1234",
				passwordConfirmation: "1234"
			})
			.expect(200);
	});

	test("Should return an error on failure", async () => {
		const response = await request(app)
			.post("/api/signup")
			.send({
				username: "janeDoe",
				email: "invalid-email",
				password: "1234",
				passwordConfirmation: "1234"
			})
			.expect(400);

		expect(response.body).toEqual({
			error: new InvalidParamError("email").message
		});
	});
});