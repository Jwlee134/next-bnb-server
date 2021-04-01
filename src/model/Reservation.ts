import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IReservation } from "../types/reservation";

const ReservationSchema: Schema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

export default mongoose.model<IReservation>("Reservation", ReservationSchema);
