import { ValidationComposite } from "@presentation/helpers/validation/ValidationComposite";
import { LoginValidationFactory } from "@main/factories/login/LoginValidationFactory";
import { RequiredFieldValidation } from "@presentation/helpers/validation/fields/RequiredFieldValidation";
import { IValidation } from "@presentation/protocols/validation/IValidation";

jest.mock("@presentation/helpers/validation/ValidationComposite");

describe("LoginValidationFactory", () => {
	test("Should call ValidationComposite with all validations", () => {
		LoginValidationFactory.validate();

		const validations: IValidation[] = [];

		for (const field of ["username", "password"])
			validations.push(new RequiredFieldValidation(field));

		expect(ValidationComposite).toHaveBeenCalledWith(validations);
	});
});