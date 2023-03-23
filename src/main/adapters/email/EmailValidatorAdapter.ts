import { IEmailValidator } from "@presentation/protocols/validation/email/IEmailValidator";
import validator from "validator";

export class EmailValidatorAdapter implements IEmailValidator {
	public isValid(email: string): boolean {
		return validator.isEmail(email);
	}
}