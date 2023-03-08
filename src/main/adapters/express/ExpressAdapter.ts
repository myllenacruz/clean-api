import { IController } from "@presentation/protocols/controllers/IController";
import { Request, Response } from "express";
import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";

export class ExpressAdapter {
	public static route(controller: IController) {
		return async (request: Request, response: Response) => {
			const httpRequest: IHttpRequest = {
				body: request.body
			};

			const httpResponse = await controller.handle(httpRequest);

			return response.status(httpResponse.statusCode).json(httpResponse.body);
		};
	}
}