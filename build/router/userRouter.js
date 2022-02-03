"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_1 = require("../controller/user");
var review_1 = require("../controller/user/review");
var userRouter = express_1.default.Router();
userRouter.route("/").get(user_1.getUser).put(user_1.updateUser);
userRouter.get("/review", review_1.getReview);
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map