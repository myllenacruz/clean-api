export class ServerError extends Error {
	public readonly statusCode: number;

	constructor(stack?: string) {
		super("Internal Server Error");
		this.statusCode = 500;
		this.stack = stack;
	}
}