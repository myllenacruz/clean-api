import { ValidationComposite } from "@presentation/helpers/validation/ValidationComposite";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { IValidation } from "@presentation/helpers/validation/IValidation";
import { IInput } from "@presentation/helpers/validation/interfaces/IInput";

function makeValidation(): IValidation {
	class Validation implements IValidation {
		validate(input: IInput): Error | null {
			return new MissingParamError("field");
		}
	}

	return new Validation();
}

describe("ValidationComposite", () => {
	test("Should return an error if any validation fails", () => {
		const validation = makeValidation();
		const systemUnderTest = new ValidationComposite([validation]);
		const error = systemUnderTest.validate({ field: "anyValue" });

		expect(error).toEqual(new MissingParamError("field"));
	});
});