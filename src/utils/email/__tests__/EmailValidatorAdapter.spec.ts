import { EmailValidatorAdapter } from "@utils/email/EmailValidatorAdapter";
import validator from "validator";

function makeSut(): EmailValidatorAdapter {
	return new EmailValidatorAdapter();
}

describe("EmailValidatorAdapter", () => {
	test("Should return false if validator returns false", () => {
		const systemUnderTest = makeSut();

		jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);

		const isValid = systemUnderTest.isValid("invalid@email.com");

		expect(isValid).toBe(false);
	});

	test("Should return true if validator returns true", () => {
		const sut = makeSut();
		const isValid = sut.isValid("valid@email.com");

		expect(isValid).toBe(true);
	});
});