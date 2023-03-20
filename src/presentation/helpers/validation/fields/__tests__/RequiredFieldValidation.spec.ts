import { RequiredFieldValidation } from "@presentation/helpers/validation/RequiredFieldValidation";
import { MissingParamError } from "@presentation/errors/MissingParamError";

describe("RequiredFieldValidation", () => {
	test("Should return a MissingParamError if validation fails", () => {
		const systemUnderTest = new RequiredFieldValidation("test");

		const error = systemUnderTest.validate({ username: "jane" });

		expect(error).toEqual(new MissingParamError("test"));
	});
});