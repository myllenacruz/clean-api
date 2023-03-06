import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";

export interface IController {
	handle(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}