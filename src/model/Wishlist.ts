import mongoose, { Schema } from "mongoose";

const WishlistSchema: Schema = new mongoose.Schema({
  title: String,
  list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Wishlist", WishlistSchema);
