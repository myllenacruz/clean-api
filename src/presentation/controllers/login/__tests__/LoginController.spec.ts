import { LoginController } from "@presentation/controllers/login/LoginController";
import { HttResponse } from "@presentation/helpers/HttpResponse";
import { MissingParamError } from "@presentation/errors/MissingParamError";

interface ISystemUnderTest {
	systemUnderTest: LoginController;
}

function makeSystemUnderTest(): ISystemUnderTest {
	const systemUnderTest = new LoginController();

	return {
		systemUnderTest
	};
}

describe("LoginController", () => {
	test("Should return 400 if no username is provided", async () => {
		const { systemUnderTest } = makeSystemUnderTest();

		const httpRequest = {
			body: {
				password: "1234"
			}
		};

		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse).toEqual(HttResponse.badRequest(new MissingParamError("username")));
	});

	test("Should return 400 if no password is provided", async () => {
		const { systemUnderTest } = makeSystemUnderTest();

		const httpRequest = {
			body: {
				email: "janedoe@email.com"
			}
		};

		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse).toEqual(HttResponse.badRequest(new MissingParamError("password")));
	});
});