import { IValidation } from "@presentation/protocols/validation/IValidation";
import { IEmailValidator } from "@presentation/protocols/validation/email/IEmailValidator";
import { InvalidParamError } from "@presentation/errors/InvalidParamError";
import { IInput } from "@presentation/protocols/validation/IInput";

export class EmailValidation implements IValidation {
	private readonly field: string;
	private readonly emailValidator: IEmailValidator;

	constructor(field: string, emailValidator: IEmailValidator) {
		this.field = field;
		this.emailValidator = emailValidator;
	}

	public validate(input: IInput): Error | null {
		if (!this.emailValidator.isValid(input[this.field]))
			return new InvalidParamError(this.field);

		return null;
	}
}