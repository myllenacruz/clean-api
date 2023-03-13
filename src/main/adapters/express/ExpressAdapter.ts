import { IController } from "@presentation/protocols/controllers/IController";
import { Request, Response } from "express";

export class ExpressAdapter {
	public static route(controller: IController) {
		return async (request: Request, response: Response) => {
			const httpResponse = await controller.handle({
				body: request.body
			});

			if (httpResponse.statusCode == 200)
				return response.status(httpResponse.statusCode).json(httpResponse.body);

			else
				return response.status(httpResponse.statusCode).json({ error:
					httpResponse.body.message
				});
		};
	}
}