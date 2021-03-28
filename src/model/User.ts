import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IUser } from "../types/user";

const UserSchema: Schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  birthday: Date,
  avatarUrl: String,
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
  reservationRequest: [
    {
      roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
      guestId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      checkIn: Date,
      checkOut: Date,
      guestCount: Number,
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

export default mongoose.model<IUser>("User", UserSchema);
