import { IValidation } from "@presentation/helpers/validation/IValidation";
import { IInput } from "@presentation/helpers/validation/interfaces/IInput";

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