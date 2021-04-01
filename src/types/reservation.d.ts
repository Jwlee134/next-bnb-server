import { Document } from "mongoose";
import { IRoom } from "./room";
import { IUser } from "./user";

export interface IReservation extends Document {
  room: IRoom["_id"];
  guest: IUser["_id"];
  host: IUser["_id"];
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  price: number;
  createdAt: Date;
  guestReviewed: boolean;
  hostReviewed: boolean;
}
