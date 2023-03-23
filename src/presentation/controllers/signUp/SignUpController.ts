import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { ICreateAccount } from "@domain/useCases/account/ICreateAccount";
import { IValidation } from "@presentation/protocols/validation/IValidation";
import { IAuthentication } from "@domain/useCases/authentication/IAuthentication";

export class SignUpController implements IController {
	private readonly createAccount: ICreateAccount;
	private readonly validation: IValidation;
	private readonly authentication: IAuthentication;

	constructor(
		createAccount: ICreateAccount,
		validation: IValidation,
		authentication: IAuthentication
	) {
		this.createAccount = createAccount;
		this.validation = validation;
		this.authentication = authentication;
	}

	public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		try {
			const {
				username,
				email,
				password
			} = httpRequest.body;

			const validationError = this.validation.validate(httpRequest.body);

			if (validationError)
				return HttpResponse.badRequest(validationError);

			const account = await this.createAccount.handle({
				username,
				email,
				password
			});

			await this.authentication.auth({
				username,
				password
			});

			return HttpResponse.success(account);
		} catch (error) {
			return HttpResponse.serverError(error as Error);
		}
	}
}