import { SignUpController } from "@presentation/controllers/signUp/SignUpController";
import { MissingParamError } from "@presentation/errors/MissingParamError";

describe("SignUp Controller", () => {
	test("Should return 400 if no username is provided", () => {
		const systemUnderTest = new SignUpController();

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
		const systemUnderTest = new SignUpController();

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
});