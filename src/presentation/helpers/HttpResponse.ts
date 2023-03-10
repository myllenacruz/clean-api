import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { ServerError } from "@presentation/errors/ServerError";

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

	static success(data: unknown): IHttpResponse {
		return {
			statusCode: 200,
			body: data
		};
	}
}