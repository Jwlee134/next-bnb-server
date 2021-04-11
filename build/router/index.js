"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var file_1 = require("../controller/file");
var location_1 = require("../controller/location");
var oauth_1 = require("../controller/oauth");
var place_1 = require("../controller/place");
var reservation_1 = require("../controller/reservation");
var review_1 = require("../controller/review");
var authRouter_1 = __importDefault(require("./authRouter"));
var roomRouter_1 = __importDefault(require("./roomRouter"));
var userRouter_1 = __importDefault(require("./userRouter"));
var wishlistRouter_1 = __importDefault(require("./wishlistRouter"));
var router = express_1.default.Router();
router.use("/auth", authRouter_1.default);
router.use("/room", roomRouter_1.default);
router.use("/wishlist", wishlistRouter_1.default);
router.use("/user", userRouter_1.default);
router.get("/location", location_1.getLocation);
router.get("/place", place_1.getPlace);
router.post("/oauth", oauth_1.postOauth);
router.post("/review", review_1.postReview);
router.route("/file").post(file_1.postFile).delete(file_1.deleteFile);
router.route("/reservation").get(reservation_1.getReservation).post(reservation_1.postReservation);
exports.default = router;
//# sourceMappingURL=index.js.map