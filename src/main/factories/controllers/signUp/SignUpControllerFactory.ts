import { SignUpController } from "@presentation/controllers/signUp/SignUpController";
import { IController } from "@presentation/protocols/controllers/IController";
import { SignUpValidationFactory } from "@main/factories/controllers/signUp/SignUpValidationFactory";
import { AuthenticationDataFactory } from "@main/factories/useCases/authentication/AuthenticationDataFactory";
import { CreateAccountDataFactory } from "@main/factories/useCases/account/CreateAccountDataFactory";
import { LogControllerDecoratorFactory } from "@main/factories/decorators/log/LogControllerDecoratorFactory";

export class SignUpControllerFactory {
	static handle(): IController {
		const controller = new SignUpController(
			CreateAccountDataFactory.handle(),
			SignUpValidationFactory.validate(),
			AuthenticationDataFactory.authentication()
		);

		return LogControllerDecoratorFactory.handle(controller);
	}
}