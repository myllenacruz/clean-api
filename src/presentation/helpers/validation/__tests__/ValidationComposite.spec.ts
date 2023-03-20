import { ValidationComposite } from "@presentation/helpers/validation/ValidationComposite";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { IValidation } from "@presentation/helpers/validation/IValidation";
import { IInput } from "@presentation/helpers/validation/interfaces/IInput";

interface ISystemUnderTest {
	systemUnderTest: ValidationComposite;
	validations: IValidation[];
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
	const validations = [makeValidation(), makeValidation()];
	const systemUnderTest = new ValidationComposite(validations);

	return {
		validations,
		systemUnderTest
	};
}

describe("ValidationComposite", () => {
	test("Should return an error if any validation fails", () => {
		const { systemUnderTest, validations } = makeSystemUnderTest();

		jest.spyOn(validations[0], "validate").mockReturnValue(
			new MissingParamError("field")
		);

		const error = systemUnderTest.validate({ field: "anyValue" });

		expect(error).toEqual(new MissingParamError("field"));
	});

	test("Should return the first error if more then one validation fails", () => {
		const { systemUnderTest, validations } = makeSystemUnderTest();

		jest.spyOn(validations[0], "validate").mockReturnValue(
			new Error()
		);

		jest.spyOn(validations[1], "validate").mockReturnValue(
			new MissingParamError("field")
		);

		const error = systemUnderTest.validate({ field: "anyValue" });

		expect(error).toEqual(new Error());
	});

	test("Should not return if validation succeeds", () => {
		const { systemUnderTest } = makeSystemUnderTest();
		const error = systemUnderTest.validate({ field: "anyValue" });

		expect(error).toBeFalsy();
	});
});