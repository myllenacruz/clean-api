import { RequiredFieldValidation } from "@presentation/helpers/validation/fields/RequiredFieldValidation";
import { MissingParamError } from "@presentation/errors/MissingParamError";

function makeSystemUnderTest(): RequiredFieldValidation {
	return new RequiredFieldValidation("field");
}

describe("RequiredFieldValidation", () => {
	test("Should return a MissingParamError if validation fails", () => {
		const systemUnderTest = makeSystemUnderTest();
		const error = systemUnderTest.validate({ username: "jane" });

		expect(error).toEqual(new MissingParamError("field"));
	});

	test("Should not return if validation success", () => {
		const systemUnderTest = makeSystemUnderTest();
		const error = systemUnderTest.validate({ field: "jane" });

		expect(error).toBeFalsy();
	});
});