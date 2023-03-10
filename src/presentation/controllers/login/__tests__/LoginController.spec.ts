import { LoginController } from "@presentation/controllers/login/LoginController";
import { HttResponse } from "@presentation/helpers/HttpResponse";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";

interface ISystemUnderTest {
	systemUnderTest: LoginController;
	authentication: IAuthentication;
}

function makeSystemUnderTest(): ISystemUnderTest {
	const authentication = makeAuthentication();
	const systemUnderTest = new LoginController(authentication);

	return {
		systemUnderTest,
		authentication
	};
}

function makeAuthentication(): IAuthentication {
	class Authentication implements IAuthentication {
		async auth(username: string, password: string): Promise<string> {
			return "anyToken";
		}
	}

	return new Authentication();
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
				username: "janedoe"
			}
		};

		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse).toEqual(HttResponse.badRequest(new MissingParamError("password")));
	});

	test("Should call Authentication with correct values", async () => {
		const { systemUnderTest , authentication } = makeSystemUnderTest();

		const authSpy = jest.spyOn(authentication, "auth");

		const httpRequest = {
			body: {
				username: "janedoe",
				password: "1234"
			}
		};

		await systemUnderTest.handle(httpRequest);

		expect(authSpy).toHaveBeenCalledWith("janedoe", "1234");
	});
});