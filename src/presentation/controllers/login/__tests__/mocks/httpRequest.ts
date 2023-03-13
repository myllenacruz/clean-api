import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";

export const validRequest: IHttpRequest = {
	body: {
		username: "janeDoe",
		password: "1234"
	}
};

export const invalidRequest: IHttpRequest = {
	body: {
		username: "invalid",
		password: "1234"
	}
};