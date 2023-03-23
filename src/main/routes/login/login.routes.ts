import { ExpressAdapter } from "@main/adapters/express/ExpressAdapter";
import { Router } from "express";
import { LoginControllerFactory } from "@main/factories/controllers/login/LoginControllerFactory";

export default (router: Router): void => {
	router.post("/login",
		ExpressAdapter.route(LoginControllerFactory.handle())
	);
};