import { IController } from "@presentation/protocols/controllers/IController";
import { LogMongoDbRepository } from "@infra/database/mongoDb/repositories/log/LogMongoDbRepository";
import { LogControllerDecorator } from "@main/decorators/log/LogControllerDecorator";

export class LogControllerDecoratorFactory {
	static handle(controller: IController): IController {
		const logMongoDbRepository = new LogMongoDbRepository();
		return new LogControllerDecorator(controller, logMongoDbRepository);
	}
}