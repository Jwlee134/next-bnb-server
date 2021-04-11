"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var ReservationSchema = new mongoose_1.default.Schema({
    room: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Room" },
    guest: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    host: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    checkIn: Date,
    checkOut: Date,
    guestCount: Number,
    price: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    guestReviewed: { type: Boolean, default: false },
    hostReviewed: { type: Boolean, default: false },
});
exports.default = mongoose_1.default.model("Reservation", ReservationSchema);
//# sourceMappingURL=Reservation.js.map