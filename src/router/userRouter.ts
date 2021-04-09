import express from "express";
import { getUser, updateUser } from "../controller/user";
import { getReview } from "../controller/user/review";

const userRouter = express.Router();

userRouter.route("/").get(getUser).put(updateUser);
userRouter.get("/review", getReview);

export default userRouter;
