import { IValidation } from "@presentation/helpers/validation/IValidation";
import { RequiredFieldValidation } from "@presentation/helpers/validation/fields/RequiredFieldValidation";
import { ValidationComposite } from "@presentation/helpers/validation/ValidationComposite";

export class LoginValidationFactory {
	static validate(): ValidationComposite {
		const validations: IValidation[] = [];

		for (const field of ["username", "password"])
			validations.push(new RequiredFieldValidation(field));

		return new ValidationComposite(validations);
	}
}