import request from "supertest";
import app from "@main/config/app";

describe("ContentTypeMiddleware", () => {
	test("Should return default content type as JSON", async () => {
		app.get("/test-content-type", (request, response) => {
			response.send();
		});

		await request(app)
			.get("/test-content-type")
			.expect("content-type", /json/);
	});

	test("Should return XML content when forced", async () => {
		app.get("/test-content-type-xml", (request, response) => {
			response.type("xml");
			response.send();
		});

		await request(app)
			.get("/test-content-type-xml")
			.expect("content-type", /xml/);
	});
});