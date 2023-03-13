import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { ServerError } from "@presentation/errors/ServerError";
import { UnauthorizedError } from "@presentation/errors/UnauthorizedError";

export class HttpResponse {
	static badRequest(error: Error): IHttpResponse {
		return {
			statusCode: 400,
			body: error
		};
	}

	static serverError(error: Error): IHttpResponse {
		return {
			statusCode: 500,
			body: new ServerError(error.stack!)
		};
	}

	static unauthorized(): IHttpResponse {
		return {
			statusCode: 401,
			body: new UnauthorizedError()
		};
	}

	static success(data: unknown): IHttpResponse {
		return {
			statusCode: 200,
			body: data
		};
	}
}