"use strict";
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
exports.postReservation = exports.getReservation = void 0;
var Reservation_1 = __importDefault(require("../../model/Reservation"));
var Room_1 = __importDefault(require("../../model/Room"));
var User_1 = __importDefault(require("../../model/User"));
var getReservation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var keyword, user, currentUser, reservations, filtered, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                keyword = req.query.keyword, user = req.headers.user;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                if (!keyword) return [3 /*break*/, 3];
                return [4 /*yield*/, User_1.default.findById(user)];
            case 2:
                currentUser = _b.sent();
                if (currentUser) {
                    currentUser.unreadNotifications = currentUser.unreadNotifications.filter(function (notif) { return !notif.label.includes(keyword); });
                    currentUser.save();
                }
                else {
                    return [2 /*return*/, res.status(404).send("로그인이 필요한 서비스입니다.")];
                }
                _b.label = 3;
            case 3:
                reservations = void 0, filtered = void 0;
                _a = keyword;
                switch (_a) {
                    case "myRoom": return [3 /*break*/, 4];
                    case "past": return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 4: return [4 /*yield*/, Reservation_1.default.find({ host: user })
                    .populate({
                    path: "room",
                    model: Room_1.default,
                })
                    .populate({
                    path: "guest",
                    model: User_1.default,
                })
                    .sort("-checkIn")];
            case 5:
                reservations = _b.sent();
                return [2 /*return*/, res.status(200).send(reservations)];
            case 6: return [4 /*yield*/, Reservation_1.default.find({
                    guest: user,
                })
                    .populate({
                    path: "room",
                    model: Room_1.default,
                })
                    .sort("-checkIn")];
            case 7:
                reservations = _b.sent();
                filtered = reservations.filter(function (reservation) {
                    return reservation.checkOut.getTime() < Date.now();
                });
                return [2 /*return*/, res.status(200).send(filtered)];
            case 8: return [4 /*yield*/, Reservation_1.default.find({
                    guest: user,
                })
                    .populate({
                    path: "room",
                    model: Room_1.default,
                })
                    .sort("-checkIn")];
            case 9:
                reservations = _b.sent();
                filtered = reservations.filter(function (reservation) {
                    return reservation.checkOut.getTime() > Date.now();
                });
                return [2 /*return*/, res.status(200).send(filtered)];
            case 10: return [3 /*break*/, 12];
            case 11:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).end()];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.getReservation = getReservation;
var postReservation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, checkIn, checkOut, guestCount, roomId, guestId, price, room, guest, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body.body, checkIn = _a.checkIn, checkOut = _a.checkOut, guestCount = _a.guestCount, roomId = _a.roomId, guestId = _a.guestId, price = _a.price;
                return [4 /*yield*/, Room_1.default.findById(roomId)];
            case 1:
                room = _b.sent();
                return [4 /*yield*/, User_1.default.findById(guestId)];
            case 2:
                guest = _b.sent();
                if (!(room && guest)) return [3 /*break*/, 4];
                return [4 /*yield*/, Reservation_1.default.create({
                        checkIn: checkIn,
                        checkOut: checkOut,
                        guestCount: guestCount,
                        price: price,
                        room: room._id,
                        guest: guest._id,
                        host: room.creator,
                    })];
            case 3:
                _b.sent();
                room.blockedDayList.push(checkIn);
                room.blockedDayList.push(checkOut);
                room.save();
                return [2 /*return*/, res.status(204).end()];
            case 4: return [2 /*return*/, res.status(404).send("존재하지 않는 숙소입니다.")];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).end()];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.postReservation = postReservation;
//# sourceMappingURL=index.js.map