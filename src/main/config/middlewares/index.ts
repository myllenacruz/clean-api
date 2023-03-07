import { Express } from "express";
import { bodyParser } from "../middlewares/bodyParser/BodyParserMiddleware";
import { cors } from "../middlewares/cors/CorsMiddleware";
import { contentType } from "../middlewares/contentType/ContentTypeMiddleware";

export default (app: Express): void => {
	app.use(bodyParser);
	app.use(cors);
	app.use(contentType);
};