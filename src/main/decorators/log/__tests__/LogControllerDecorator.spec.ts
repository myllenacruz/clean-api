import { LogControllerDecorator } from "@main/decorators/log/LogControllerDecorator";
import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { ILogErrorRepository } from "@data/protocols/log/ILogErrorRepository";
import { validRequest } from "@main/decorators/log/__tests__/mocks/httpRequest";
import { accountModel } from "@main/decorators/log/__tests__/mocks/account";
import { serverError } from "@main/decorators/log/__tests__/mocks/serverError";

interface ISystemUnderTest {
	systemUnderTest: LogControllerDecorator;
	controller: IController;
	logErrorRepository: ILogErrorRepository;
}

function makeController(): IController {
	class Controller implements IController {
		async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
			return new Promise(resolve => resolve(
				HttpResponse.success(accountModel))
			);
		}
	}

	return new Controller();
}

function makeLogErrorRepository(): ILogErrorRepository {
	class LogErrorRepository implements ILogErrorRepository {
		async logError(stack: string): Promise<void> {
			return new Promise(resolve => resolve());
		}
	}

	return new LogErrorRepository();
}

function makeSystemUnderTest(): ISystemUnderTest {
	const controller = makeController();
	const logErrorRepository = makeLogErrorRepository();
	const systemUnderTest = new LogControllerDecorator(controller, logErrorRepository);

	return {
		systemUnderTest,
		controller,
		logErrorRepository
	};
}

describe("LogControllerDecorator", () => {
	test("Should call controller handle", async () => {
		const { systemUnderTest, controller } = makeSystemUnderTest();

		const handleSpy = jest.spyOn(controller, "handle");

		await systemUnderTest.handle(validRequest);

		expect(handleSpy).toHaveBeenCalledWith(validRequest);
	});

	test("Should return the same result of controller", async () => {
		const { systemUnderTest } = makeSystemUnderTest();

		const httpResponse = await systemUnderTest.handle(validRequest);

		expect(httpResponse).toEqual(HttpResponse.success(accountModel));
	});

	test("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
		const {
			systemUnderTest,
			controller,
			logErrorRepository
		} = makeSystemUnderTest();

		const logSpy = jest.spyOn(logErrorRepository, "logError");

		jest.spyOn(controller, "handle").mockReturnValueOnce(
			new Promise(resolve => resolve(serverError()))
		);

		await systemUnderTest.handle(validRequest);

		expect(logSpy).toHaveBeenCalledWith("any");
	});
});