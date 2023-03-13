import { InvalidParamError } from "@presentation/errors/InvalidParamError";
import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { IController } from "@presentation/protocols/controllers/IController";
import { IEmailValidator } from "@presentation/protocols/email/IEmailValidator";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { ICreateAccount } from "@domain/useCases/account/ICreateAccount";
import { IValidation } from "@presentation/helpers/validation/IValidation";

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;
	private readonly createAccount: ICreateAccount;
	private readonly validation: IValidation;

	constructor(
		emailValidator: IEmailValidator,
		createAccount: ICreateAccount,
		validation: IValidation
	) {
		this.emailValidator = emailValidator;
		this.createAccount = createAccount;
		this.validation = validation;
	}

	public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		try {
			const validationError = this.validation.validate(httpRequest.body);

			if (validationError) return HttpResponse.badRequest(validationError);

			const {
				username,
				email,
				password
			} = httpRequest.body;

			if (!this.emailValidator.isValid(email))
				return HttpResponse.badRequest(new InvalidParamError("email"));

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