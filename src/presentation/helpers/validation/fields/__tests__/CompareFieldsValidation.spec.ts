import { InvalidParamError } from "@presentation/errors/InvalidParamError";
import { CompareFieldsValidation } from "@presentation/helpers/validation/fields/CompareFieldsValidation";

function makeSystemUnderTest(): CompareFieldsValidation {
	return new CompareFieldsValidation("field", "fieldToCompare");
}

describe("CompareFieldsValidation", () => {
	test("Should return a InvalidParamError if validation fails", () => {
		const systemUnderTest = makeSystemUnderTest();
		const error = systemUnderTest.validate({
			field: "anyValue",
			fieldToCompare: "wrongValue"
		});

		expect(error).toEqual(new InvalidParamError("fieldToCompare"));
	});

	test("Should not return if validation success", () => {
		const systemUnderTest = makeSystemUnderTest();
		const error = systemUnderTest.validate({
			field: "anyValue",
			fieldToCompare: "anyValue"
		});

		expect(error).toBeFalsy();
	});
});