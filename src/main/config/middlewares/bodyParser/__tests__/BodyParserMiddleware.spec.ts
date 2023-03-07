import request from "supertest";
import app from "@main/config/app";

describe("BodyParserMiddleware", () => {
	test("Should parse body as JSON", async () => {
		app.post("/test-body-parser", (request, response) => {
			response.send(request.body);
		});

		await request(app)
			.post("/test-body-parser")
			.send({ username: "janeDoe" })
			.expect({ username: "janeDoe" });
	});
});