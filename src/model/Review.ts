import mongoose, { Schema } from "mongoose";
import { IReview } from "../types/review";

const ReviewSchema: Schema = new mongoose.Schema({
  text: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IReview>("Review", ReviewSchema);
