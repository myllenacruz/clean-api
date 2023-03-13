import { CompareFieldsValidation } from "@presentation/helpers/validation/CompareFieldsValidation";
import { IValidation } from "@presentation/helpers/validation/IValidation";
import { RequiredFieldValidation } from "@presentation/helpers/validation/RequiredFieldValidation";
import { ValidationComposite } from "@presentation/helpers/validation/ValidationComposite";

export class SignUpValidationFactory {
	static validate(): ValidationComposite {
		const validations: IValidation[] = [];

		for (const field of ["username", "email", "password", "passwordConfirmation"])
			validations.push(new RequiredFieldValidation(field));

		validations.push(new CompareFieldsValidation("password", "passwordConfirmation"));

		return new ValidationComposite(validations);
	}
}