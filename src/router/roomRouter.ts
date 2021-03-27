import express from "express";
import { deleteRoom, getRoom, postRoom, updateRoom } from "../controller/room";
import { getManagement } from "../controller/room/management";
import { postRegisterRoom } from "../controller/room/register";
import { getSearchResults } from "../controller/room/search";

const roomRouter = express.Router();

roomRouter.post("/", postRoom);
roomRouter.get("/search", getSearchResults);
roomRouter.get("/management", getManagement);
roomRouter.post("/register", postRegisterRoom);

roomRouter.route("/:id").get(getRoom).put(updateRoom).delete(deleteRoom);

export default roomRouter;
