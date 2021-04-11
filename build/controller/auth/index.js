"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogout = exports.postSignUp = exports.getMe = exports.postLogin = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var User_1 = __importDefault(require("../../model/User"));
var postLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, correctPassword, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 2:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).send("이메일 또는 비밀번호가 일치하지 않습니다.")];
                }
                if (!user.password) {
                    return [2 /*return*/, res.status(400).send("소셜 계정으로 이미 가입된 이메일입니다.")];
                }
                correctPassword = bcryptjs_1.default.compareSync(password, user.password);
                if (!correctPassword) {
                    return [2 /*return*/, res.status(404).send("이메일 또는 비밀번호가 일치하지 않습니다.")];
                }
                token = jsonwebtoken_1.default.sign(user.id, process.env.JWT_SECRET_KEY);
                res.cookie("access_token", token, {
                    expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 3),
                    httpOnly: true,
                    path: "/",
                    sameSite: "none",
                    secure: true,
                });
                return [2 /*return*/, res.status(200).send(__assign(__assign({}, user.toObject()), { isLoggedIn: true }))];
            case 3:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).end()];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.postLogin = postLogin;
var getMe = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, userId, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!req.cookies) return [3 /*break*/, 2];
                token = req.cookies.access_token;
                if (!token) return [3 /*break*/, 2];
                userId = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                return [4 /*yield*/, User_1.default.findById(userId)];
            case 1:
                user = _a.sent();
                if (user) {
                    return [2 /*return*/, res.status(200).send(__assign(__assign({}, user.toObject()), { isLoggedIn: true }))];
                }
                else {
                    return [2 /*return*/, res.status(404).send("존재하지 않는 사용자입니다.")];
                }
                _a.label = 2;
            case 2: return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                return [2 /*return*/, res.status(500).end()];
            case 4: return [2 /*return*/, res.json({ isLoggedIn: false })];
        }
    });
}); };
exports.getMe = getMe;
var postSignUp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, birthday, user, hash, newUser, token, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, birthday = _a.birthday;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 2:
                user = _b.sent();
                if (user)
                    return [2 /*return*/, res.status(409).send("이미 가입된 이메일입니다.")];
                hash = bcryptjs_1.default.hashSync(password, 10);
                return [4 /*yield*/, User_1.default.create({
                        name: name,
                        email: email,
                        password: hash,
                        birthday: birthday,
                        avatarUrl: "/static/image/user/default_user_profile_image.jpg",
                    })];
            case 3:
                newUser = _b.sent();
                token = jsonwebtoken_1.default.sign(newUser.id, process.env.JWT_SECRET_KEY);
                res.cookie("access_token", token, {
                    expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 3),
                    httpOnly: true,
                    path: "/",
                    sameSite: "none",
                    secure: true,
                });
                return [2 /*return*/, res.status(200).send(__assign(__assign({}, newUser.toObject()), { isLoggedIn: true }))];
            case 4:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(500).end()];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.postSignUp = postSignUp;
var postLogout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, res
                .clearCookie("access_token", { path: "/", sameSite: "none", secure: true })
                .status(200)
                .json({ isLoggedIn: false })];
    });
}); };
exports.postLogout = postLogout;
//# sourceMappingURL=index.js.map