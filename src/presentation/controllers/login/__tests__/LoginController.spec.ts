import { LoginController } from "@presentation/controllers/login/LoginController";
import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";
import { invalidRequest, validRequest } from "@presentation/controllers/login/__tests__/mocks/httpRequest";

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
		async auth(
			username: string,
			password: string
		): Promise<string> {
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

		expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError("username")));
	});

	test("Should return 400 if no password is provided", async () => {
		const { systemUnderTest } = makeSystemUnderTest();

		const httpRequest = {
			body: {
				username: "janedoe"
			}
		};

		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError("password")));
	});

	test("Should call Authentication with correct values", async () => {
		const { systemUnderTest , authentication } = makeSystemUnderTest();

		const authSpy = jest.spyOn(authentication, "auth");

		await systemUnderTest.handle(validRequest);

		expect(authSpy).toHaveBeenCalledWith("janeDoe", "1234");
	});

	test("Should return 401 an invalid credentials are provided", async () => {
		const { systemUnderTest, authentication } = makeSystemUnderTest();

		jest.spyOn(authentication, "auth").mockReturnValueOnce(
			new Promise(resolve => resolve(""))
		);

		const httpResponse = await systemUnderTest.handle(invalidRequest);

		expect(httpResponse).toEqual(HttpResponse.unauthorized());
	});

	test("Should return 500 if Authentication throws", async () => {
		const { systemUnderTest, authentication } = makeSystemUnderTest();

		jest.spyOn(authentication, "auth").mockImplementationOnce(() => {
			throw new Error();
		});

		const httpResponse = await systemUnderTest.handle(invalidRequest);

		expect(httpResponse).toEqual(HttpResponse.serverError(new Error()));
	});

	test("Should return 200 if valid credentials are provided", async () => {
		const { systemUnderTest } = makeSystemUnderTest();

		const httpResponse = await systemUnderTest.handle(validRequest);

		expect(httpResponse).toEqual(HttpResponse.success({
			accessToken: "anyToken"
		}));
	});
});