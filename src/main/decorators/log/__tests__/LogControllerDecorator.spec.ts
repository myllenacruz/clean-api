import { LogControllerDecorator } from "@main/decorators/log/LogControllerDecorator";
import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { HttResponse } from "@presentation/helpers/HttpResponse";
import { ILogErrorRepository } from "@data/protocols/log/ILogErrorRepository";

interface ISystemUnderTest {
	systemUnderTest: LogControllerDecorator;
	controller: IController;
	logErrorRepository: ILogErrorRepository;
}

function makeController(): IController {
	class Controller implements IController {
		async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
			const httpResponse: IHttpResponse = {
				statusCode: 200,
				body: {
					username: "janeDoe",
					email: "janedoe@email.com",
					password: "1234"
				}
			};

			return new Promise(resolve => resolve(httpResponse));
		}
	}

	return new Controller();
}

function makeLogErrorRepository(): ILogErrorRepository {
	class LogErrorRepository implements ILogErrorRepository {
		async log(stack: string): Promise<void> {
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
		const httpRequest = {
			body: {
				username: "janeDoe",
				email: "janedoe@email.com",
				password: "1234",
				passwordConfirmation: "1234"
			}
		};

		await systemUnderTest.handle(httpRequest);

		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});

	test("Should return the same result of controller", async () => {
		const { systemUnderTest } = makeSystemUnderTest();
		const httpRequest = {
			body: {
				username: "janeDoe",
				email: "janedoe@email.com",
				password: "1234",
				passwordConfirmation: "1234"
			}
		};

		const httpResponse = await systemUnderTest.handle(httpRequest);

		expect(httpResponse).toEqual({
			statusCode: 200,
			body: {
				username: "janeDoe",
				email: "janedoe@email.com",
				password: "1234"
			}
		});
	});

	test("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
		const {
			systemUnderTest,
			controller,
			logErrorRepository
		} = makeSystemUnderTest();

		const httpRequest = {
			body: {
				username: "janeDoe",
				email: "janedoe@email.com",
				password: "1234",
				passwordConfirmation: "1234"
			}
		};

		const fakeError = new Error();

		fakeError.stack = "any";

		const error = HttResponse.serverError(fakeError);

		const logSpy = jest.spyOn(logErrorRepository, "log");

		jest.spyOn(controller, "handle").mockReturnValueOnce(
			new Promise(resolve => resolve(error))
		);

		await systemUnderTest.handle(httpRequest);

		expect(logSpy).toHaveBeenCalledWith("any");
	});
});