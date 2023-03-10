import { HttResponse } from "@presentation/helpers/HttpResponse";
import { IHttpResponse } from "@presentation/protocols/http/IHttpResponse";

export function serverError(): IHttpResponse {
	const fakeError = new Error();

	fakeError.stack = "any";

	return HttResponse.serverError(fakeError);
}