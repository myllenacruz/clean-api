import { IHttpRequest } from "@presentation/protocols/http/IHttpRequest";

export const validRequest: IHttpRequest = {
	body: {
		username: "janeDoe",
		email: "janedoe@email.com",
		password: "1234",
		passwordConfirmation: "1234"
	}
};

export const invalidRequest: IHttpRequest = {
	body: {
		email: "invalid@email.com",
		password: "1234",
		passwordConfirmation: "1234",
		username: "invalid"
	}
};