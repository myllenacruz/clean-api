export class MissingParamError extends Error {
	public readonly param: string;
	public readonly statusCode: number;

	constructor(param: string, statusCode = 400) {
		super(`Missign Param Error: ${param}`);
		this.param = param;
		this.statusCode = statusCode;
	}
}