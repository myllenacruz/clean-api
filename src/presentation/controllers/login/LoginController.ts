import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";

export class LoginController implements IController {
	private readonly authentication: IAuthentication;

	constructor(authentication: IAuthentication) {
		this.authentication = authentication;
	}

	public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		try {
			const requiredFields = [
				"username",
				"password"
			];

			const {
				username,
				password
			} = httpRequest.body;

			for (const field of requiredFields) {
				if (!httpRequest.body[field])
					return HttpResponse.badRequest(new MissingParamError(field));
			}

			const accessToken = await this.authentication.auth(username, password);

			if (!accessToken) return HttpResponse.unauthorized();

			return HttpResponse.success({ accessToken });
		} catch (error) {
			return HttpResponse.serverError(error as Error);
		}
	}
}