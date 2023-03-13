import { IValidation } from "@presentation/helpers/validation/IValidation";
import { InvalidParamError } from "@presentation/errors/InvalidParamError";

export class CompareFieldsValidation implements IValidation {
	private readonly field: string;
	private readonly fieldToCompare: string;

	constructor(field: string, fieldToCompare: string) {
		this.field = field;
		this.fieldToCompare = fieldToCompare;
	}

	public validate(input: any): Error | null {
		if (input[this.field] !== input[this.fieldToCompare])
			return new InvalidParamError(this.fieldToCompare);

		return null;
	}
}