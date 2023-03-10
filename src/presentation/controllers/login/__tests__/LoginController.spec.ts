import { LoginController } from "@presentation/controllers/login/LoginController";
import { HttResponse } from "@presentation/helpers/HttpResponse";
import { MissingParamError } from "@presentation/errors/MissingParamError";

describe("LoginController", () => {
	test("Should return 400 if no username is provided", async () => {
		const systemUnderTest = new LoginController();
		const httpRequest = {
			body: {
				password: "1234"
			}
		};
		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse).toEqual(HttResponse.badRequest(new MissingParamError("username")));
	});
});