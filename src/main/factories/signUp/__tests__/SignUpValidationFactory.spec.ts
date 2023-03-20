import { ValidationComposite } from "@presentation/helpers/validation/ValidationComposite";
import { SignUpValidationFactory } from "@main/factories/signUp/SignUpValidationFactory";
import { RequiredFieldValidation } from "@presentation/helpers/validation/fields/RequiredFieldValidation";
import { IValidation } from "@presentation/protocols/validation/IValidation";
import { CompareFieldsValidation } from "@presentation/helpers/validation/fields/CompareFieldsValidation";
import { EmailValidation } from "@presentation/helpers/validation/email/EmailValidation";
import { IEmailValidator } from "@presentation/protocols/email/IEmailValidator";

jest.mock("@presentation/helpers/validation/ValidationComposite");

function makeEmailValidator() {
	class EmailValidator implements IEmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	return new EmailValidator();
}

describe("SignUpValidationFactory", () => {
	test("Should call ValidationComposite with all validations", () => {
		SignUpValidationFactory.validate();

		const validations: IValidation[] = [];

		for (const field of ["username", "email", "password", "passwordConfirmation"])
			validations.push(new RequiredFieldValidation(field));

		validations.push(new CompareFieldsValidation("password", "passwordConfirmation"));

		validations.push(new EmailValidation("email", makeEmailValidator()));

		expect(ValidationComposite).toHaveBeenCalledWith(validations);
	});
});