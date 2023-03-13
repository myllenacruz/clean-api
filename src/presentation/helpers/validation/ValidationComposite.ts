import { IValidation } from "@presentation/helpers/validation/IValidation";

export class ValidationComposite implements IValidation {
	private readonly validations: IValidation[];

	constructor(validations: IValidation[]) {
		this.validations = validations;
	}

	validate(input: any): Error | null {
		for(const validation of this.validations) {
			const error = validation.validate(input);

			if (error) return error;
		}

		return null;
	}
}