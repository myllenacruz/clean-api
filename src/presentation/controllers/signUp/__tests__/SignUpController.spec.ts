import { SignUpController } from "@presentation/controllers/signUp/SignUpController";
import { MissingParamError } from "@presentation/errors/MissingParamError";

function makeSystemUnderTest(): SignUpController {
	return new SignUpController();
}

describe("SignUp Controller", () => {
	test("Should return 400 if no username is provided", () => {
		const systemUnderTest = makeSystemUnderTest();

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
		const systemUnderTest = makeSystemUnderTest();

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
		const systemUnderTest = makeSystemUnderTest();

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
		const systemUnderTest = makeSystemUnderTest();

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
});