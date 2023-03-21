import express from "express";
import configMiddleware from "@main/config/middlewares";
import configRoutes from "@main/config/routes";

const app = express();

configMiddleware(app);
configRoutes(app);

export default app;