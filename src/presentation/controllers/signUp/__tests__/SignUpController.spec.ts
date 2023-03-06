import { SignUpController } from "@presentation/controllers/signUp/SignUpController";
import { InvalidParamError } from "@presentation/errors/InvalidParamError";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { ServerError } from "@presentation/errors/ServerError";
import { IEmailValidator } from "@presentation/protocols/email/IEmailValidator";

interface ISystemUnderTest {
	systemUnderTest: SignUpController;
	emailValidator: IEmailValidator;
}

function makeEmailValidator() {
	class EmailValidator implements IEmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	return new EmailValidator();
}

function makeSystemUnderTest(): ISystemUnderTest {
	const emailValidator = makeEmailValidator();
	const systemUnderTest = new SignUpController(emailValidator);

	return {
		systemUnderTest,
		emailValidator
	};
}

describe("SignUp Controller", () => {
	test("Should return 400 if no username is provided", () => {
		const { systemUnderTest } = makeSystemUnderTest();

		const httpRequest = {
			body: {
				email: "any@email.com",
				password: "1234",
				passwordConfirmation: "1234"
			}
		};

		const httpResponse = systemUnderTest.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("username"));
	});

	test("Should return 400 if no email is provided", () => {
		const { systemUnderTest } = makeSystemUnderTest();

		const httpRequest = {
			body: {
				username: "any",
				password: "1234",
				passwordConfirmation: "1234"
			}
		};

		const httpResponse = systemUnderTest.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("email"));
	});

	test("Should return 400 if no password is provided", () => {
		const { systemUnderTest } = makeSystemUnderTest();

		const httpRequest = {
			body: {
				username: "any",
				email: "any@email.com",
				passwordConfirmation: "1234"
			}
		};

		const httpResponse = systemUnderTest.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("password"));
	});

	test("Should return 400 if no password confirmation is provided", () => {
		const { systemUnderTest } = makeSystemUnderTest();

		const httpRequest = {
			body: {
				username: "any",
				password: "1234",
				email: "any@email.com"
			}
		};

		const httpResponse = systemUnderTest.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"));
	});

	test("Should return 400 if an invalid email is provided", () => {
		const { systemUnderTest, emailValidator } = makeSystemUnderTest();

		jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false);

		const httpRequest = {
			body: {
				username: "any",
				email: "any@email.com",
				password: "1234",
				passwordConfirmation: "1234"
			}
		};

		const httpResponse = systemUnderTest.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError("email"));
	});

	test("Should call EmailValidator with correct email", () => {
		const { systemUnderTest, emailValidator } = makeSystemUnderTest();

		const isEmailValid = jest.spyOn(emailValidator, "isValid");

		const httpRequest = {
			body: {
				email: "invalid@email.com",
				password: "1234",
				passwordConfirmation: "1234",
				username: "any"
			}
		};

		systemUnderTest.handle(httpRequest);
		expect(isEmailValid).toHaveBeenCalledWith("invalid@email.com");
	});

	test("Should return 500 if EmailValidator throws", () => {
		const { systemUnderTest, emailValidator } = makeSystemUnderTest();

		jest.spyOn(emailValidator, "isValid").mockImplementationOnce(() => {
			throw new Error();
		});

		const httpRequest = {
			body: {
				email: "invalid@email.com",
				password: "1234",
				passwordConfirmation: "1234",
				username: "janedoe"
			}
		};

		const httpResponse = systemUnderTest.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});

});