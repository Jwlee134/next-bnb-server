import express from "express";
import { getMe, postLogin, postLogout, postSignUp } from "../controller/auth";

const authRouter = express.Router();

authRouter.post("/login", postLogin);
authRouter.post("/signUp", postSignUp);
authRouter.post("/logout", postLogout);
authRouter.get("/me", getMe);

export default authRouter;
