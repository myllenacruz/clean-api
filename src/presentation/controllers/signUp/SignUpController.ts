import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { ICreateAccount } from "@domain/useCases/account/ICreateAccount";
import { IValidation } from "@presentation/protocols/validation/IValidation";

export class SignUpController implements IController {
	private readonly createAccount: ICreateAccount;
	private readonly validation: IValidation;

	constructor(
		createAccount: ICreateAccount,
		validation: IValidation
	) {
		this.createAccount = createAccount;
		this.validation = validation;
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

			return HttpResponse.success(account);
		} catch (error) {
			return HttpResponse.serverError(error as Error);
		}
	}
}