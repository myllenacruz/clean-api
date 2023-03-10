import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { HttResponse } from "@presentation/helpers/HttpResponse";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";

export class LoginController implements IController {
	private readonly authentication: IAuthentication;

	constructor(authentication: IAuthentication) {
		this.authentication = authentication;
	}

	public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		try {
			const {
				username,
				password
			} = httpRequest.body;

			if (!username)
				return HttResponse.badRequest(new MissingParamError("username"));

			if (!password)
				return HttResponse.badRequest(new MissingParamError("password"));

			await this.authentication.auth(username, password);

			return HttResponse.success(httpRequest.body);
		} catch (error) {
			return HttResponse.serverError(error as Error);
		}
	}
}