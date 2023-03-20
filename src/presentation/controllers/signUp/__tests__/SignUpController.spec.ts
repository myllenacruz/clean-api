import { IAccountModel } from "@domain/models/account/IAccountModel";
import { ICreateAccount } from "@domain/useCases/account/ICreateAccount";
import { ICreateAccountModel } from "@domain/useCases/account/ICreateAccountModel";
import { SignUpController } from "@presentation/controllers/signUp/SignUpController";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { ServerError } from "@presentation/errors/ServerError";
import { invalidRequest, validRequest } from "@presentation/controllers/signUp/__tests__/mocks/httpRequest";
import { accountModel } from "@presentation/controllers/signUp/__tests__/mocks/account";
import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { IValidation } from "@presentation/protocols/validation/IValidation";
import { IInput } from "@presentation/protocols/validation/IInput";

interface ISystemUnderTest {
	createAccount: ICreateAccount;
	systemUnderTest: SignUpController;
	validation: IValidation
}

async function makeCreateAccount(): Promise<ICreateAccount> {
	class CreateAccount implements ICreateAccount {
		async handle(account: ICreateAccountModel): Promise<IAccountModel> {
			return new Promise(resolve => resolve(accountModel));
		}
	}

	return new CreateAccount();
}

function makeValidation(): IValidation {
	class Validation implements IValidation {
		validate(input: IInput): Error | null {
			return null;
		}
	}

	return new Validation();
}

async function makeSystemUnderTest(): Promise<ISystemUnderTest> {
	const createAccount = await makeCreateAccount();
	const validation = makeValidation();
	const systemUnderTest = new SignUpController(createAccount, validation);

	return {
		systemUnderTest,
		createAccount,
		validation
	};
}

describe("SignUp Controller", () => {
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
			HttpResponse.serverError(new ServerError(""))
		);
	});

	test("Should return 200 if valid datas is provided", async () => {
		const { systemUnderTest } = await makeSystemUnderTest();
		const httpResponse = await systemUnderTest.handle(validRequest);

		expect(httpResponse).toEqual(HttpResponse.success(accountModel));
	});

	test("Should call Validation with correct values", async () => {
		const { systemUnderTest, validation } = await makeSystemUnderTest();
		const validateSpy = jest.spyOn(validation, "validate");

		await systemUnderTest.handle(validRequest);

		expect(validateSpy).toHaveBeenCalledWith(validRequest.body);
	});

	test("Should return 400 if Validation returns an error", async () => {
		const { systemUnderTest, validation } = await makeSystemUnderTest();

		jest.spyOn(validation, "validate").mockReturnValueOnce(new MissingParamError("field"));

		const httpResponse = await systemUnderTest.handle(validRequest);

		expect(httpResponse).toEqual(HttpResponse.badRequest(new MissingParamError("field")));
	});
});