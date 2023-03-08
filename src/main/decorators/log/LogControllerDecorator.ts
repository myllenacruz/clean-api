import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";

export class LogControllerDecorator implements IController {
	private readonly controller: IController;

	constructor(controller: IController) {
		this.controller = controller;
	}

	public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		const httpResponse = await this.controller.handle(httpRequest);
		return httpResponse;
	}
}