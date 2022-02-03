"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var ReviewSchema = new mongoose_1.default.Schema({
    text: String,
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    room: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Room",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("Review", ReviewSchema);
//# sourceMappingURL=Review.js.map