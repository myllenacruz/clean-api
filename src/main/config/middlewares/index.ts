import { Express } from "express";
import { bodyParser } from "@main/config/middlewares/bodyParser/BodyParserMiddleware";
import { cors } from "@main/config/middlewares/cors/CorsMiddleware";

export default (app: Express): void => {
	app.use(bodyParser);
	app.use(cors);
};