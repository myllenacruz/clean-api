export class UnauthorizedError extends Error {
	public readonly statusCode: number;

	constructor() {
		super("Unauthorized Error");
		this.statusCode = 401;
	}
}