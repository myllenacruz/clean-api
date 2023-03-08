import { LogControllerDecorator } from "@main/decorators/log/LogControllerDecorator";
import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";

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

describe("LogControllerDecorator", () => {
	test("Should call controller handle", async () => {
		const controller = new Controller();
		const handleSpy = jest.spyOn(controller, "handle");
		const systemUnderTest = new LogControllerDecorator(controller);
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