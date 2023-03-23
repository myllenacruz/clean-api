import { IEmailValidator } from "@presentation/protocols/validation/email/IEmailValidator";
import { EmailValidation } from "@presentation/helpers/validation/email/EmailValidation";
import { InvalidParamError } from "@presentation/errors/InvalidParamError";

interface ISystemUnderTest {
	systemUnderTest: EmailValidation;
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
	const systemUnderTest = new EmailValidation("email", emailValidator);

	return {
		systemUnderTest,
		emailValidator
	};
}

describe("EmailValidation", () => {
	test("Should return an error if EmailValidator returns false", () => {
		const { systemUnderTest, emailValidator } = makeSystemUnderTest();

		jest.spyOn(emailValidator, "isValid").mockReturnValue(false);

		const validationError = systemUnderTest.validate({ email: "janedoe@email.com" });

		expect(validationError).toEqual(new InvalidParamError("email"));
	});


	test("Should call EmailValidator with correct email", () => {
		const { systemUnderTest, emailValidator } = makeSystemUnderTest();

		const isEmailValid = jest.spyOn(emailValidator, "isValid");

		systemUnderTest.validate({ email: "janedoe@email.com" });

		expect(isEmailValid).toHaveBeenCalledWith("janedoe@email.com");
	});

	test("Should throw if EmailValidator throws", () => {
		const { systemUnderTest, emailValidator } = makeSystemUnderTest();

		jest.spyOn(emailValidator, "isValid").mockImplementationOnce(() => {
			throw new Error();
		});

		expect(systemUnderTest.validate).toThrow();
	});
});