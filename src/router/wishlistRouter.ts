import express from "express";
import { getWishlist, postWishlist } from "../controller/wishlist";
import {
  deleteOneWishlist,
  updateOneWishlist,
} from "../controller/wishlist/id";
import { postItem, deleteItem } from "../controller/wishlist/item";

const wishlistRouter = express.Router();

wishlistRouter.route("/").get(getWishlist).post(postWishlist);
wishlistRouter.route("/item").post(postItem).delete(deleteItem);

wishlistRouter.route("/:id").patch(updateOneWishlist).delete(deleteOneWishlist);

export default wishlistRouter;
