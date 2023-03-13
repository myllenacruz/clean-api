import { IInput } from "@presentation/helpers/validation/interfaces/IInput";

export interface IValidation {
	validate(input: IInput): Error | null;
}