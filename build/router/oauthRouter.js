"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var github_1 = require("../controller/oauth/github");
var google_1 = require("../controller/oauth/google");
var kakao_1 = require("../controller/oauth/kakao");
var oauthRouter = express_1.default.Router();
oauthRouter.post("/kakao", kakao_1.postKakao);
oauthRouter.post("/github", github_1.postGithub);
oauthRouter.post("/google", google_1.postGoogle);
exports.default = oauthRouter;
//# sourceMappingURL=oauthRouter.js.map