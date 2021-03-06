import express from "express";

import { deleteFile, postFile } from "../controller/file";
import { getLocation } from "../controller/location";
import { getPlace } from "../controller/place";
import { getReservation, postReservation } from "../controller/reservation";
import { postReview } from "../controller/review";

import authRouter from "./authRouter";
import oauthRouter from "./oauthRouter";
import roomRouter from "./roomRouter";
import userRouter from "./userRouter";
import wishlistRouter from "./wishlistRouter";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/room", roomRouter);
router.use("/wishlist", wishlistRouter);
router.use("/user", userRouter);
router.use("/oauth", oauthRouter);

router.get("/location", getLocation);
router.get("/place", getPlace);

router.post("/review", postReview);
router.route("/file").post(postFile).delete(deleteFile);
router.route("/reservation").get(getReservation).post(postReservation);

export default router;
