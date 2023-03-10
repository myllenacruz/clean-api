import { IController } from "@presentation/protocols/controllers/IController";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";
import { ILogErrorRepository } from "@data/protocols/log/ILogErrorRepository";

export class LogControllerDecorator implements IController {
	private readonly controller: IController;
	private readonly logErrorRepository?: ILogErrorRepository;

	constructor(
		controller: IController,
		logErrorRepository?: ILogErrorRepository
	) {
		this.controller = controller;
		this.logErrorRepository = logErrorRepository;
	}

	public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
		const httpResponse = await this.controller.handle(httpRequest);

		if (httpResponse.statusCode === 500)
			await this.logErrorRepository?.logError(httpResponse.body.stack);

		return httpResponse;
	}
}