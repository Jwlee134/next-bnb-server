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
exports.getSearchResults = void 0;
var date_fns_1 = require("date-fns");
var Room_1 = __importDefault(require("../../model/Room"));
var getSearchResults = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, latitude, longitude, checkIn_1, checkOut_1, adults, children, _b, page, _c, limit, _d, roomType, _e, minPrice, _f, maxPrice, _g, bedCount, _h, bedroomCount, _j, bathroomCount, _k, buildingType_1, _l, amenities_1, _m, spaces_1, _o, coordsBounds, formatDates, datesArray, data, filteredByBuildingType, filteredByAmenities, filteredBySpaces, filteredByAvailability, slicedFiltered, slicedData, error_1;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                _p.trys.push([0, 2, , 3]);
                _a = req.query, latitude = _a.latitude, longitude = _a.longitude, checkIn_1 = _a.checkIn, checkOut_1 = _a.checkOut, adults = _a.adults, children = _a.children, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? "10" : _c, _d = _a.roomType, roomType = _d === void 0 ? ["entire", "public", "private"] : _d, _e = _a.minPrice, minPrice = _e === void 0 ? "0" : _e, _f = _a.maxPrice, maxPrice = _f === void 0 ? "999999999999" : _f, _g = _a.bedCount, bedCount = _g === void 0 ? "0" : _g, _h = _a.bedroomCount, bedroomCount = _h === void 0 ? "0" : _h, _j = _a.bathroomCount, bathroomCount = _j === void 0 ? "0" : _j, _k = _a.buildingType, buildingType_1 = _k === void 0 ? [] : _k, _l = _a.amenities, amenities_1 = _l === void 0 ? [] : _l, _m = _a.spaces, spaces_1 = _m === void 0 ? [] : _m, _o = _a.coordsBounds, coordsBounds = _o === void 0 ? "0.02" : _o;
                formatDates = [];
                if (checkIn_1 && checkOut_1) {
                    datesArray = date_fns_1.eachDayOfInterval({
                        start: new Date(checkIn_1),
                        end: new Date(checkOut_1),
                    });
                    // 데이터베이스에 저장된 날짜의 형식으로 포맷
                    formatDates = datesArray.map(function (date) {
                        return date_fns_1.format(date, "yyyy-MM-dd");
                    });
                }
                return [4 /*yield*/, Room_1.default.find({
                        // 숙소의 위도 경도가 현재 위도 경도 기준 ±0.02 이내인 것들로 필터링
                        latitude: {
                            $gte: Number(latitude) - Number(coordsBounds),
                            $lte: Number(latitude) + Number(coordsBounds),
                        },
                        longitude: {
                            $gte: Number(longitude) - Number(coordsBounds),
                            $lte: Number(longitude) + Number(coordsBounds),
                        },
                        // 호스트가 설정해둔 예약 불가 날짜에 체크인, 체크아웃 날짜가 포함되어 있으면 필터링
                        blockedDayList: {
                            $nin: formatDates,
                        },
                        // 최대 게스트 인원이 숙소 최대 게스트 인원보다 높으면 필터링
                        maximumGuestCount: {
                            $gte: Number(adults) + Number(children),
                        },
                        // 기본적으로 예약 차단(0)이면 필터링
                        availability: {
                            $gte: 1,
                        },
                        // 검색 필터(집 전체, 개인실, 다인실)
                        roomType: {
                            $in: roomType,
                        },
                        // 가격 필터
                        price: {
                            $gte: Number(minPrice),
                            $lte: Number(maxPrice),
                        },
                        // 셋 중 하나라도 만족하지 않으면 필터링
                        $and: [
                            {
                                bedCount: {
                                    $gte: Number(bedCount),
                                },
                            },
                            {
                                bedroomCount: {
                                    $gte: Number(bedroomCount),
                                },
                            },
                            {
                                bathroomCount: {
                                    $gte: Number(bathroomCount),
                                },
                            },
                        ],
                    })];
            case 1:
                data = _p.sent();
                filteredByBuildingType = data.filter(function (_a) {
                    var label = _a.largeBuildingType.label;
                    var options = [];
                    if (typeof buildingType_1 === "string") {
                        options = [buildingType_1];
                    }
                    else {
                        options = buildingType_1;
                    }
                    if (options.length === 0)
                        return true;
                    return options.includes(label);
                });
                filteredByAmenities = filteredByBuildingType.filter(function (room) {
                    var options = [];
                    if (typeof amenities_1 === "string") {
                        options = [amenities_1];
                    }
                    else {
                        options = amenities_1;
                    }
                    if (amenities_1.length === 0)
                        return true;
                    return options.every(function (option) { return room.amenities.includes(option); });
                });
                filteredBySpaces = filteredByAmenities.filter(function (room) {
                    var options = [];
                    if (typeof spaces_1 === "string") {
                        options = [spaces_1];
                    }
                    else {
                        options = spaces_1;
                    }
                    if (spaces_1.length === 0)
                        return true;
                    return options.every(function (option) { return room.spaces.includes(option); });
                });
                // 호스트가 설정해둔 최대 예약 가능 월보다 체크인, 체크아웃 날짜가 넘어가면 필터링
                if (checkIn_1 && checkOut_1) {
                    filteredByAvailability = filteredBySpaces.filter(function (room) {
                        // 항상 가능이면 필터링하지 않음
                        if (room.availability === 1)
                            return true;
                        var availability = date_fns_1.addMonths(new Date(), room.availability);
                        var checkInDate = date_fns_1.addHours(new Date(checkIn_1), -3);
                        var checkOutDate = date_fns_1.addHours(new Date(checkOut_1), -3);
                        return availability >= checkInDate && availability >= checkOutDate;
                    });
                    slicedFiltered = filteredByAvailability.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
                    return [2 /*return*/, res.status(200).json({
                            data: slicedFiltered,
                            originalLength: filteredByAvailability.length,
                        })];
                }
                slicedData = filteredBySpaces.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
                return [2 /*return*/, res.status(200).json({
                        data: slicedData,
                        originalLength: filteredBySpaces.length,
                    })];
            case 2:
                error_1 = _p.sent();
                return [2 /*return*/, res.status(400).send("숙소를 불러올 수 없습니다.")];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSearchResults = getSearchResults;
//# sourceMappingURL=search.js.map