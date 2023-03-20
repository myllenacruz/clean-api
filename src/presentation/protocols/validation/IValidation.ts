import { IInput } from "@presentation/protocols/validation/IInput";

export interface IValidation {
	validate(input: IInput): Error | null;
}