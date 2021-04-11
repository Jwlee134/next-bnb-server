"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var RoomSchema = new mongoose_1.default.Schema({
    largeBuildingType: {
        label: String,
        description: String,
    },
    buildingType: {
        label: String,
        description: String,
    },
    roomType: String,
    isForGuest: String,
    maximumGuestCount: Number,
    bedroomCount: Number,
    bedCount: Number,
    bedType: [
        {
            id: Number,
            beds: [{ label: String, count: Number }],
        },
    ],
    publicBedType: [{ label: String, count: Number }],
    bathroomCount: Number,
    country: String,
    province: String,
    city: String,
    streetAddress: String,
    detailAddress: String,
    postalCode: String,
    latitude: Number,
    longitude: Number,
    amenities: [String],
    spaces: [String],
    photos: [String],
    description: String,
    title: String,
    forbiddenRules: [String],
    customRules: [String],
    availability: Number,
    blockedDayList: [String],
    price: Number,
    rating: [{ label: String, value: Number, _id: false }],
    avgOfRating: { type: Number, default: 0 },
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    review: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("Room", RoomSchema);
//# sourceMappingURL=Room.js.map