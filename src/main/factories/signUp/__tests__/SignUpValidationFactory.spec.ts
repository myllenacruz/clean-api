import { ValidationComposite } from "@presentation/helpers/validation/ValidationComposite";
import { SignUpValidationFactory } from "@main/factories/signUp/SignUpValidationFactory";
import { RequiredFieldValidation } from "@presentation/helpers/validation/RequiredFieldValidation";
import { IValidation } from "@presentation/helpers/validation/IValidation";

jest.mock("@presentation/helpers/validation/ValidationComposite");

describe("SignUpValidationFactory", () => {
	test("Should call ValidationComposite with all validations", () => {
		SignUpValidationFactory.validate();

		const validations: IValidation[] = [];

		for (const field of ["username", "email", "password", "passwordConfirmation"])
			validations.push(new RequiredFieldValidation(field));

		expect(ValidationComposite).toHaveBeenCalledWith(validations);
	});
});