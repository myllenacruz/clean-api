import { InvalidParamError } from "@presentation/errors/InvalidParamError";
import { MissingParamError } from "@presentation/errors/MissingParamError";
import { HttResponse } from "@presentation/helpers/HttpResponse";
import { IController } from "@presentation/protocols/controllers/IController";
import { IEmailValidator } from "@presentation/protocols/email/IEmailValidator";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { ICreateAccount } from "@domain/useCases/account/interfaces/ICreateAccount";

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;
	private readonly createAccount: ICreateAccount;

	constructor(
		emailValidator: IEmailValidator,
		createAccount: ICreateAccount
	) {
		this.emailValidator = emailValidator;
		this.createAccount = createAccount;
	}

	public handle(httpRequest: IHttpRequest): IHttpResponse {
		try {
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
					return HttResponse.badRequest(new MissingParamError(field));
			}

			if (!this.emailValidator.isValid(email))
				return HttResponse.badRequest(new InvalidParamError("email"));

			if (password !== passwordConfirmation)
				return HttResponse.badRequest(new InvalidParamError("passwordConfirmation"));

			this.createAccount.handle({
				username,
				email,
				password
			});

			return {
				statusCode: 200
			};
		} catch (error) {
			return HttResponse.serverError();
		}
	}
}