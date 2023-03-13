import { IValidation } from "@presentation/helpers/validation/IValidation";
import { RequiredFieldValidation } from "@presentation/helpers/validation/RequiredFieldValidation";
import { ValidationComposite } from "@presentation/helpers/validation/ValidationComposite";

export class SignUpValidationFactory {
	static validate(): ValidationComposite {
		const validations: IValidation[] = [];

		for (const field of ["username", "email", "password", "passwordConfirmation"])
			validations.push(new RequiredFieldValidation(field));

		return new ValidationComposite(validations);
	}
}