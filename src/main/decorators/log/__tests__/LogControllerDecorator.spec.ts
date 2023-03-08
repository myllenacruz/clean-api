import { LogControllerDecorator } from "@main/decorators/log/LogControllerDecorator";
import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";

interface ISystemUnderTest {
	systemUnderTest: LogControllerDecorator;
	controller: IController;
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

function makeSystemUnderTest(): ISystemUnderTest {
	const controller = makeController();
	const systemUnderTest = new LogControllerDecorator(controller);

	return {
		systemUnderTest,
		controller
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
});