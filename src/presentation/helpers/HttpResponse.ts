import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { ServerError } from "@presentation/errors/ServerError";

export class HttResponse {
	static badRequest(error: Error): IHttpResponse {
		return {
			statusCode: 400,
			body: error
		};
	}

	static serverError(): IHttpResponse {
		return {
			statusCode: 500,
			body: new ServerError()
		};
	}
}