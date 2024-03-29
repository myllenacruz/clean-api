import { HttpResponse } from "@presentation/helpers/http/HttpResponse";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";

export function serverError(): IHttpResponse {
	const fakeError = new Error();

	fakeError.stack = "any";

	return HttpResponse.serverError(fakeError);
}