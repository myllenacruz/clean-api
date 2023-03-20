import { ValidationComposite } from "@presentation/helpers/validation/ValidationComposite";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { IValidation } from "@presentation/helpers/validation/IValidation";
import { IInput } from "@presentation/helpers/validation/interfaces/IInput";

interface ISystemUnderTest {
	systemUnderTest: ValidationComposite;
	validation: IValidation;
}

function makeValidation(): IValidation {
	class Validation implements IValidation {
		validate(input: IInput): Error | null {
			return null;
		}
	}

	return new Validation();
}

function makeSystemUnderTest(): ISystemUnderTest {
	const validation = makeValidation();
	const systemUnderTest = new ValidationComposite([validation]);

	return {
		validation,
		systemUnderTest
	};
}

describe("ValidationComposite", () => {
	test("Should return an error if any validation fails", () => {
		const { systemUnderTest, validation } = makeSystemUnderTest();

		jest.spyOn(validation, "validate").mockReturnValue(new MissingParamError("field"));

		const error = systemUnderTest.validate({ field: "anyValue" });

		expect(error).toEqual(new MissingParamError("field"));
	});
});