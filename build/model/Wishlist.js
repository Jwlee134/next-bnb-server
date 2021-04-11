"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var WishlistSchema = new mongoose_1.default.Schema({
    title: String,
    list: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Room",
        },
    ],
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("Wishlist", WishlistSchema);
//# sourceMappingURL=Wishlist.js.map