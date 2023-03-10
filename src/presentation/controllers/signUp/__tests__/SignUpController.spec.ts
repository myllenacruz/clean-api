import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccount } from "@domain/useCases/account/ICreateAccount";
import { ICreateAccountModel } from "@domain/useCases/account/ICreateAccountModel";
import { SignUpController } from "@presentation/controllers/signUp/SignUpController";
import { InvalidParamError } from "@presentation/errors/InvalidParamError";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { ServerError } from "@presentation/errors/ServerError";
import { IEmailValidator } from "@presentation/protocols/email/IEmailValidator";
import { invalidRequest, validRequest } from "@presentation/controllers/signUp/__tests__/mocks/httpRequest";
import { accountModel } from "@presentation/controllers/signUp/__tests__/mocks/account";
import { HttResponse } from "@presentation/helpers/HttpResponse";

interface ISystemUnderTest {
	emailValidator: IEmailValidator;
	createAccount: ICreateAccount;
	systemUnderTest: SignUpController;
}

function makeEmailValidator() {
	class EmailValidator implements IEmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	return new EmailValidator();
}

async function makeCreateAccount(): Promise<ICreateAccount> {
	class CreateAccount implements ICreateAccount {
		async handle(account: ICreateAccountModel): Promise<IAccountModel> {
			return new Promise(resolve => resolve(accountModel));
		}
	}

	return new CreateAccount();
}

async function makeSystemUnderTest(): Promise<ISystemUnderTest> {
	const emailValidator = makeEmailValidator();
	const createAccount = await makeCreateAccount();
	const systemUnderTest = new SignUpController(emailValidator, createAccount);

	return {
		systemUnderTest,
		emailValidator,
		createAccount
	};
}

describe("SignUp Controller", () => {
	test("Should return 400 if no username is provided", async () => {
		const { systemUnderTest } = await makeSystemUnderTest();

		const httpRequest = {
			body: {
				email: "any@email.com",
				password: "1234",
				passwordConfirmation: "1234"
			}
		};

		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse).toEqual(
			HttResponse.badRequest(new MissingParamError("username"))
		);
	});

	test("Should return 400 if no email is provided", async () => {
		const { systemUnderTest } = await makeSystemUnderTest();

		const httpRequest = {
			body: {
				username: "any",
				password: "1234",
				passwordConfirmation: "1234"
			}
		};

		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse).toEqual(
			HttResponse.badRequest(new MissingParamError("email"))
		);
	});

	test("Should return 400 if no password is provided", async () => {
		const { systemUnderTest } = await makeSystemUnderTest();

		const httpRequest = {
			body: {
				username: "any",
				email: "any@email.com",
				passwordConfirmation: "1234"
			}
		};

		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse).toEqual(
			HttResponse.badRequest(new MissingParamError("password"))
		);
	});

	test("Should return 400 if no password confirmation is provided", async () => {
		const { systemUnderTest } = await makeSystemUnderTest();

		const httpRequest = {
			body: {
				username: "any",
				password: "1234",
				email: "any@email.com"
			}
		};

		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse).toEqual(
			HttResponse.badRequest(new MissingParamError("passwordConfirmation"))
		);
	});

	test("Should return 400 if password confirmation fails", async () => {
		const { systemUnderTest } = await makeSystemUnderTest();

		const httpRequest = {
			body: {
				email: "janedoe@email.com",
				password: "1234",
				passwordConfirmation: "invalid",
				username: "janedoe"
			}
		};

		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);

		expect(httpResponse).toEqual(
			HttResponse.badRequest(new InvalidParamError("passwordConfirmation"))
		);
	});

	test("Should return 400 if an invalid email is provided", async () => {
		const { systemUnderTest, emailValidator } = await makeSystemUnderTest();

		jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false);

		const httpResponse = await systemUnderTest.handle(invalidRequest);

		expect(httpResponse).toEqual(
			HttResponse.badRequest(new InvalidParamError("email"))
		);
	});

	test("Should call EmailValidator with correct email", async () => {
		const { systemUnderTest, emailValidator } = await makeSystemUnderTest();

		const isEmailValid = jest.spyOn(emailValidator, "isValid");

		await systemUnderTest.handle(validRequest);
		expect(isEmailValid).toHaveBeenCalledWith("janedoe@email.com");
	});

	test("Should return 500 if EmailValidator throws", async () => {
		const { systemUnderTest, emailValidator } = await makeSystemUnderTest();

		jest.spyOn(emailValidator, "isValid").mockImplementationOnce(() => {
			throw new Error();
		});

		const httpResponse = await systemUnderTest.handle(invalidRequest);

		expect(httpResponse).toEqual(
			HttResponse.serverError(new ServerError(""))
		);
	});

	test("Should call CreateAccount with correct values", async () => {
		const { systemUnderTest, createAccount } = await makeSystemUnderTest();

		const createAccountSpy = jest.spyOn(createAccount, "handle");

		await systemUnderTest.handle(validRequest);

		expect(createAccountSpy).toHaveBeenCalledWith({
			email: "janedoe@email.com",
			password: "1234",
			username: "janeDoe"
		});
	});

	test("Should return 500 if CreateAccount throws", async () => {
		const { systemUnderTest, createAccount } = await makeSystemUnderTest();

		jest.spyOn(createAccount, "handle").mockImplementationOnce(() => {
			throw new Error();
		});

		const httpResponse = await systemUnderTest.handle(invalidRequest);

		expect(httpResponse).toEqual(
			HttResponse.serverError(new ServerError(""))
		);
	});

	test("Should return 200 if valid datas is provided", async () => {
		const { systemUnderTest } = await makeSystemUnderTest();
		const httpResponse = await systemUnderTest.handle(validRequest);

		expect(httpResponse).toEqual(HttResponse.success(accountModel));
	});
});