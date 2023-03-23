import { ExpressAdapter } from "@main/adapters/express/ExpressAdapter";
import { Router } from "express";
import { SignUpControllerFactory } from "@main/factories/controllers/signUp/SignUpControllerFactory";

export default (router: Router): void => {
	router.post("/signup",
		ExpressAdapter.route(SignUpControllerFactory.handle())
	);
};