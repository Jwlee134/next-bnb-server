"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var UserSchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
    password: String,
    birthday: Date,
    avatarUrl: String,
    introduction: String,
    rooms: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Room" }],
    review: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Review" }],
    reviewFromGuest: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Review" }],
    reviewFromHost: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Review" }],
    wishlist: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Wishlist" }],
    unreadNotifications: [{ _id: false, label: String }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.js.map