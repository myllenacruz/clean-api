import { LoginController } from "@presentation/controllers/login/LoginController";
import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";
import { invalidRequest, validRequest } from "@presentation/controllers/login/__tests__/mocks/httpRequest";
import { IValidation } from "@presentation/protocols/validation/IValidation";
import { IInput } from "@presentation/protocols/validation/IInput";
import { IAuthenticationParams } from "@domain/models/authentication/IAuthenticationParams";

interface ISystemUnderTest {
	systemUnderTest: LoginController;
	authentication: IAuthentication;
	validation: IValidation;
}

function makeSystemUnderTest(): ISystemUnderTest {
	const authentication = makeAuthentication();
	const validation = makeValidation();
	const systemUnderTest = new LoginController(authentication, validation);

	return {
		systemUnderTest,
		authentication,
		validation
	};
}

function makeAuthentication(): IAuthentication {
	class Authentication implements IAuthentication {
		async auth(
			authentication: IAuthenticationParams
		): Promise<string> {
			return "anyToken";
		}
	}

	return new Authentication();
}

function makeValidation(): IValidation {
	class Validation implements IValidation {
		validate(input: IInput): Error | null {
			return null;
		}
	}

	return new Validation();
}

describe("LoginController", () => {
	test("Should call Authentication with correct values", async () => {
		const { systemUnderTest , authentication } = makeSystemUnderTest();

		const authSpy = jest.spyOn(authentication, "auth");

		await systemUnderTest.handle(validRequest);

		expect(authSpy).toHaveBeenCalledWith({
			username: "janeDoe",
			password: "1234"
		});
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

	test("Should call Validation with correct values", async () => {
		const { systemUnderTest, validation } = makeSystemUnderTest();
		const validateSpy = jest.spyOn(validation, "validate");

		await systemUnderTest.handle(validRequest);

		expect(validateSpy).toHaveBeenCalledWith(validRequest.body);
	});

	test("Should return 400 if Validation returns an error", async () => {
		const { systemUnderTest, validation } = makeSystemUnderTest();

		jest.spyOn(validation, "validate").mockReturnValueOnce(new MissingParamError("field"));

		const httpResponse = await systemUnderTest.handle(validRequest);

		expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError("field")));
	});
});