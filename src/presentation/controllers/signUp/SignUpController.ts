import { MissingParamError } from "@presentation/errors/MissingParamError";
import { HttResponse } from "@presentation/helpers/HttpResponse";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";

export class SignUpController {
	public handle(httpRequest: IHttpRequest): IHttpResponse {
		const requiredFields = [
			"username",
			"email"
		];

		for (const field of requiredFields) {
			if (!httpRequest.body[field])
				return HttResponse.badRequest(new MissingParamError(field));
		}

		return {
			statusCode: 200
		};
	}
}