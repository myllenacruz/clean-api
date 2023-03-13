import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { HttpResponse } from "@presentation/helpers/HttpResponse";
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

			const accesToken = await this.authentication.auth(username, password);

			if (!accesToken) return HttpResponse.unauthorized();

			return HttpResponse.success(httpRequest.body);
		} catch (error) {
			return HttpResponse.serverError(error as Error);
		}
	}
}