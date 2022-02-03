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
exports.postReview = void 0;
var Reservation_1 = __importDefault(require("../../model/Reservation"));
var Review_1 = __importDefault(require("../../model/Review"));
var Room_1 = __importDefault(require("../../model/Room"));
var User_1 = __importDefault(require("../../model/User"));
var postReview = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, rating, text, reservation, isToGuest, currentReservation, guest, host, room_1, newReview, newReview, sum_1, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body.body, rating = _a.rating, text = _a.text, reservation = _a.reservation, isToGuest = _a.isToGuest;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 15, , 16]);
                return [4 /*yield*/, Reservation_1.default.findById(reservation)];
            case 2:
                currentReservation = _b.sent();
                if (!currentReservation) return [3 /*break*/, 13];
                if (isToGuest) {
                    currentReservation.hostReviewed = true;
                    currentReservation.save();
                }
                else {
                    currentReservation.guestReviewed = true;
                    currentReservation.save();
                }
                return [4 /*yield*/, User_1.default.findById(currentReservation.guest)];
            case 3:
                guest = _b.sent();
                return [4 /*yield*/, User_1.default.findById(currentReservation.host)];
            case 4:
                host = _b.sent();
                return [4 /*yield*/, Room_1.default.findById(currentReservation.room)];
            case 5:
                room_1 = _b.sent();
                if (!isToGuest) return [3 /*break*/, 9];
                if (!(host && guest)) return [3 /*break*/, 7];
                return [4 /*yield*/, Review_1.default.create({
                        text: text,
                        creator: host,
                        room: room_1,
                    })];
            case 6:
                newReview = _b.sent();
                guest.reviewFromHost.push(newReview._id);
                guest.save();
                host.review.push(newReview._id);
                host.save();
                return [2 /*return*/, res.status(200).end()];
            case 7: return [2 /*return*/, res.status(404).send("존재하지 않는 게스트입니다.")];
            case 8: return [3 /*break*/, 12];
            case 9:
                if (!(host && guest && room_1)) return [3 /*break*/, 11];
                return [4 /*yield*/, Review_1.default.create({
                        text: text,
                        creator: guest,
                        room: room_1,
                    })];
            case 10:
                newReview = _b.sent();
                guest.review.push(newReview._id);
                guest.save();
                host.reviewFromGuest.push(newReview._id);
                host.save();
                room_1.review.push(newReview);
                if (room_1.rating.length === 0) {
                    room_1.rating = rating;
                }
                else {
                    room_1.rating = room_1.rating.map(function (currentItem) {
                        rating.forEach(function (item) {
                            if (currentItem.label !== item.label)
                                return;
                            currentItem.value = Number(((currentItem.value * (room_1.review.length - 1) +
                                item.value) /
                                room_1.review.length).toFixed(2));
                        });
                        return { label: currentItem.label, value: currentItem.value };
                    });
                }
                sum_1 = 0;
                room_1.rating.forEach(function (item) {
                    sum_1 += item.value;
                });
                room_1.avgOfRating = Number((sum_1 / 6).toFixed(2));
                room_1.save();
                return [2 /*return*/, res.status(200).end()];
            case 11: return [2 /*return*/, res.status(404).send("존재하지 않는 숙소입니다.")];
            case 12: return [3 /*break*/, 14];
            case 13: return [2 /*return*/, res.status(404).send("존재하지 않는 예약입니다.")];
            case 14: return [3 /*break*/, 16];
            case 15:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).send("다시 시도해 주세요.")];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.postReview = postReview;
//# sourceMappingURL=index.js.map