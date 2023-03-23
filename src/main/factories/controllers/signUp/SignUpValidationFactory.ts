import { CompareFieldsValidation } from "@presentation/helpers/validation/fields/CompareFieldsValidation";
import { IValidation } from "@presentation/protocols/validation/IValidation";
import { RequiredFieldValidation } from "@presentation/helpers/validation/fields/RequiredFieldValidation";
import { ValidationComposite } from "@presentation/helpers/validation/ValidationComposite";
import { EmailValidation } from "@presentation/helpers/validation/email/EmailValidation";
import { EmailValidatorAdapter } from "@main/adapters/email/EmailValidatorAdapter";

export class SignUpValidationFactory {
	static validate(): ValidationComposite {
		const validations: IValidation[] = [];

		for (const field of ["username", "email", "password", "passwordConfirmation"])
			validations.push(new RequiredFieldValidation(field));

		validations.push(new CompareFieldsValidation("password", "passwordConfirmation"));

		validations.push(new EmailValidation("email", new EmailValidatorAdapter()));

		return new ValidationComposite(validations);
	}
}