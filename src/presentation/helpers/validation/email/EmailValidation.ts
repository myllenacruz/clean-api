import { IValidation } from "@presentation/helpers/validation/IValidation";
import { IEmailValidator } from "@presentation/protocols/email/IEmailValidator";
import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { InvalidParamError } from "@presentation/errors/InvalidParamError";

export class EmailValidation implements IValidation {
	private readonly field: string;
	private readonly emailValidator: IEmailValidator;

	constructor(field: string, emailValidator: IEmailValidator) {
		this.field = field;
		this.emailValidator = emailValidator;
	}

	public validate(input: any): Error | null {
		if (!this.emailValidator.isValid(input[this.field]))
			return new InvalidParamError(this.field);

		return null;
	}
}