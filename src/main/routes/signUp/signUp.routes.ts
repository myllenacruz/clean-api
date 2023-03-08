import { ExpressAdapter } from "@main/adapters/express/ExpressAdapter";
import { Router } from "express";
import { SignUpFactory } from "@main/factories/signUp/SignUpFactory";

export default (router: Router): void => {
	router.post("/signup",
		ExpressAdapter.route(SignUpFactory.controller())
	);
};