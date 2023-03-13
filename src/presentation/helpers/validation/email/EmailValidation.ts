import { IValidation } from "@presentation/helpers/validation/IValidation";
import { IEmailValidator } from "@presentation/protocols/email/IEmailValidator";
import { InvalidParamError } from "@presentation/errors/InvalidParamError";
import { IInput } from "@presentation/helpers/validation/interfaces/IInput";

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