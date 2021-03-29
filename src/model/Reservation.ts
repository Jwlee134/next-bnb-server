import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IReservation } from "../types/reservation";

const ReservationSchema: Schema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  checkIn: Date,
  checkOut: Date,
  guestCount: Number,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IReservation>("Reservation", ReservationSchema);
