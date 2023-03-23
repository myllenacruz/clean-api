import { IController } from "@presentation/protocols/controllers/IController";
import { LoginController } from "@presentation/controllers/login/LoginController";
import { LoginValidationFactory } from "@main/factories/controllers/login/LoginValidationFactory";
import { AuthenticationDataFactory } from "@main/factories/useCases/authentication/AuthenticationDataFactory";
import { LogControllerDecoratorFactory } from "@main/factories/decorators/log/LogControllerDecoratorFactory";

export class LoginControllerFactory {
	static handle(): IController {
		const controller = new LoginController(
			AuthenticationDataFactory.authentication(),
			LoginValidationFactory.validate()
		);

		return LogControllerDecoratorFactory.handle(controller);
	}
}