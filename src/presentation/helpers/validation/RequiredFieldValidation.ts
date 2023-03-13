import { IValidation } from "@presentation/helpers/validation/IValidation";
import { MissingParamError } from "@presentation/errors/MissingParamError";

export class RequiredFieldValidation implements IValidation {
	private readonly field: string;

	constructor(field: string) {
		this.field = field;
	}

	validate(input: any): Error | null {
		if (!input[this.field])
			return new MissingParamError(this.field);

		return null;
	}
}