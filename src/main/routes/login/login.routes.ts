import { ExpressAdapter } from "@main/adapters/express/ExpressAdapter";
import { Router } from "express";
import { LoginFactory } from "@main/factories/login/LoginFactory";

export default (router: Router): void => {
	router.post("/login",
		ExpressAdapter.route(LoginFactory.login())
	);
};