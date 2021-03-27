import express from "express";

import { postOauth } from "../controller/oauth";
import authRouter from "./authRouter";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

apiRouter.post("/oauth", postOauth);

export default apiRouter;
