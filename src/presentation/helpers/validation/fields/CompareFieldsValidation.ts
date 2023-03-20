import { IValidation } from "@presentation/protocols/validation/IValidation";
import { InvalidParamError } from "@presentation/errors/InvalidParamError";
import { IInput } from "@presentation/protocols/validation/IInput";

export class CompareFieldsValidation implements IValidation {
	private readonly field: string;
	private readonly fieldToCompare: string;

	constructor(field: string, fieldToCompare: string) {
		this.field = field;
		this.fieldToCompare = fieldToCompare;
	}

	public validate(input: IInput): Error | null {
		if (input[this.field] !== input[this.fieldToCompare])
			return new InvalidParamError(this.fieldToCompare);

		return null;
	}
}