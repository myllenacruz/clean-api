import { Express } from "express";
import { bodyParser } from "@main/config/middlewares/bodyParser/BodyParserMiddleware";

export default (app: Express): void => {
	app.use(bodyParser);
};