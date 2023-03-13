import { InvalidParamError } from "@presentation/errors/InvalidParamError";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { HttpResponse } from "@presentation/helpers/HttpResponse";
import { IController } from "@presentation/protocols/controllers/IController";
import { IEmailValidator } from "@presentation/protocols/email/IEmailValidator";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { ICreateAccount } from "@domain/useCases/account/ICreateAccount";
import { IValidation } from "@presentation/helpers/validation/IValidation";

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;
	private readonly createAccount: ICreateAccount;
	private readonly validation?: IValidation;

	constructor(
		emailValidator: IEmailValidator,
		createAccount: ICreateAccount,
		validation?: IValidation
	) {
		this.emailValidator = emailValidator;
		this.createAccount = createAccount;
		this.validation = validation;
	}

	public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		try {
			this.validation?.validate(httpRequest.body);

			const requiredFields = [
				"username",
				"email",
				"password",
				"passwordConfirmation"
			];

			const {
				username,
				email,
				password,
				passwordConfirmation
			} = httpRequest.body;

			for (const field of requiredFields) {
				if (!httpRequest.body[field])
					return HttpResponse.badRequest(new MissingParamError(field));
			}

			if (!this.emailValidator.isValid(email))
				return HttpResponse.badRequest(new InvalidParamError("email"));

			if (password !== passwordConfirmation)
				return HttpResponse.badRequest(new InvalidParamError("passwordConfirmation"));

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