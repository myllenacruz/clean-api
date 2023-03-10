import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { HttResponse } from "@presentation/helpers/HttpResponse";
import { MissingParamError } from "@presentation/errors/MissingParamError";

export class LoginController implements IController {
	public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		if (!httpRequest.body.username)
			return HttResponse.badRequest(new MissingParamError("username"));

		if (!httpRequest.body.password)
			return HttResponse.badRequest(new MissingParamError("password"));

		return HttResponse.success(httpRequest.body);
	}
}