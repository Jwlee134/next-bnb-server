"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("../controller/auth");
var authRouter = express_1.default.Router();
authRouter.post("/login", auth_1.postLogin);
authRouter.post("/signUp", auth_1.postSignUp);
authRouter.post("/logout", auth_1.postLogout);
authRouter.get("/me", auth_1.getMe);
exports.default = authRouter;
//# sourceMappingURL=authRouter.js.map