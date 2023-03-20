import { RequiredFieldValidation } from "@presentation/helpers/validation/RequiredFieldValidation";
import { MissingParamError } from "@presentation/errors/MissingParamError";

describe("RequiredFieldValidation", () => {
	test("Should return a MissingParamError if validation fails", () => {
		const systemUnderTest = new RequiredFieldValidation("field");

		const error = systemUnderTest.validate({ username: "jane" });

		expect(error).toEqual(new MissingParamError("field"));
	});

	test("Should not return if validation success", () => {
		const systemUnderTest = new RequiredFieldValidation("field");

		const error = systemUnderTest.validate({ field: "jane" });

		expect(error).toBeFalsy();
	});
});