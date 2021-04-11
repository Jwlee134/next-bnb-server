"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var wishlist_1 = require("../controller/wishlist");
var id_1 = require("../controller/wishlist/id");
var item_1 = require("../controller/wishlist/item");
var wishlistRouter = express_1.default.Router();
wishlistRouter.route("/").get(wishlist_1.getWishlist).post(wishlist_1.postWishlist);
wishlistRouter.route("/item").post(item_1.postItem).delete(item_1.deleteItem);
wishlistRouter
    .route("/:id")
    .get(id_1.getOneWishlist)
    .patch(id_1.updateOneWishlist)
    .delete(id_1.deleteOneWishlist);
exports.default = wishlistRouter;
//# sourceMappingURL=wishlistRouter.js.map