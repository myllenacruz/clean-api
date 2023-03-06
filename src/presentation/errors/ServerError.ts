export class ServerError extends Error {
	public readonly statusCode: number;

	constructor() {
		super("Internal Server Error");
		this.statusCode = 500;
	}
}