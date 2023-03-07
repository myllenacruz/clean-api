import request from "supertest";
import app from "@main/config/app";

describe("SignUpRoutes", () => {
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
});