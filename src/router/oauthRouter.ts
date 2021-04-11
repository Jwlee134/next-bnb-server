import express from "express";
import { postGithub } from "../controller/oauth/github";
import { postGoogle } from "../controller/oauth/google";
import { postKakao } from "../controller/oauth/kakao";

const oauthRouter = express.Router();

oauthRouter.post("/kakao", postKakao);
oauthRouter.post("/github", postGithub);
oauthRouter.post("/google", postGoogle);

export default oauthRouter;
