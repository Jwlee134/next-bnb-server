"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var room_1 = require("../controller/room");
var management_1 = require("../controller/room/management");
var register_1 = require("../controller/room/register");
var search_1 = require("../controller/room/search");
var roomRouter = express_1.default.Router();
roomRouter.post("/", room_1.postRoom);
roomRouter.get("/search", search_1.getSearchResults);
roomRouter.get("/management", management_1.getManagement);
roomRouter.post("/register", register_1.postRegisterRoom);
roomRouter.route("/:id").get(room_1.getRoom).put(room_1.updateRoom).delete(room_1.deleteRoom);
exports.default = roomRouter;
//# sourceMappingURL=roomRouter.js.map