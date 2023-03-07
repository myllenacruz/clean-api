import express from "express";
import configMiddleware from "@main/config/middlewares";

const app = express();

configMiddleware(app);

export default app;