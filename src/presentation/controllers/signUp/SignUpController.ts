import { MissingParamError } from "@presentation/errors/MissingParamError";
import { HttResponse } from "@presentation/helpers/HttpResponse";
import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";

export class SignUpController implements IController {
	public handle(httpRequest: IHttpRequest): IHttpResponse {
		const requiredFields = [
			"username",
			"email",
			"password",
			"passwordConfirmation"
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