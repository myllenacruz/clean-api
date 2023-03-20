import { IValidation } from "@presentation/protocols/validation/IValidation";
import { IInput } from "@presentation/protocols/validation/IInput";

export class ValidationComposite implements IValidation {
	private readonly validations: IValidation[];

	constructor(validations: IValidation[]) {
		this.validations = validations;
	}

	public validate(input: IInput): Error | null {
		for(const validation of this.validations) {
			const error = validation.validate(input);

			if (error) return error;
		}

		return null;
	}
}