import { IValidation } from "@presentation/helpers/validation/IValidation";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { IInput } from "@presentation/helpers/validation/interfaces/IInput";

export class RequiredFieldValidation implements IValidation {
	private readonly field: string;

	constructor(field: string) {
		this.field = field;
	}

	public validate(input: IInput): Error | null {
		if (!input[this.field])
			return new MissingParamError(this.field);

		return null;
	}
}