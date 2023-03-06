import { InvalidParamError } from "@presentation/errors/InvalidParamError";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { HttResponse } from "@presentation/helpers/HttpResponse";
import { IController } from "@presentation/protocols/controllers/IController";
import { IEmailValidator } from "@presentation/protocols/email/IEmailValidator";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;

	constructor(emailValidator: IEmailValidator) {
		this.emailValidator = emailValidator;
	}

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

		if (!this.emailValidator.isValid(httpRequest.body.email))
			return HttResponse.badRequest(new InvalidParamError("email"));

		return {
			statusCode: 200
		};
	}
}