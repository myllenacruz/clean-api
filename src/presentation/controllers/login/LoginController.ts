import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";
import { IValidation } from "@presentation/helpers/validation/IValidation";

export class LoginController implements IController {
	private readonly authentication: IAuthentication;
	private readonly validation: IValidation;

	constructor(
		authentication: IAuthentication,
		validation: IValidation
	) {
		this.authentication = authentication;
		this.validation = validation;
	}

	public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		try {
			const {
				username,
				password
			} = httpRequest.body;

			const validationError = this.validation.validate(httpRequest.body);

			if (validationError)
				return HttpResponse.badRequest(validationError);

			const accessToken = await this.authentication.auth(username, password);

			if (!accessToken) return HttpResponse.unauthorized();

			return HttpResponse.success({ accessToken });
		} catch (error) {
			return HttpResponse.serverError(error as Error);
		}
	}
}