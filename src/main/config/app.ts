import express from "express";
import configMiddleware from "../config/middlewares";
import configRoutes from "../routes";

const app = express();

configMiddleware(app);
configRoutes(app);

export default app;