import { Document } from "mongoose";

export interface IReview extends Document {
  text: string;
  creator: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
}
