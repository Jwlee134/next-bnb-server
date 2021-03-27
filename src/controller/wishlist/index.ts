import { Request, Response } from "express";
import Room from "../../model/Room";
import User from "../../model/User";
import Wishlist from "../../model/Wishlist";

export const getWishlist = async (req: Request, res: Response) => {
  const { user } = req.headers;
  try {
    const data = await Wishlist.find({ creator: user })
      .sort("-list")
      .populate({ path: "list", model: Room });
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send("위시리스트를 불러오는 데 실패했습니다.");
  }
};

export const postWishlist = async (req: Request, res: Response) => {
  const {
    body: { title },
    headers: { user: id },
  } = req;
  try {
    const user = await User.findById(id);
    if (user) {
      const newWishlist = await Wishlist.create({
        title,
        creator: id,
      });
      user.wishlist.push(newWishlist._id);
      user.save();
      return res.status(200).send(newWishlist);
    } else {
      return res.status(404).send("로그인이 필요한 서비스입니다.");
    }
  } catch (error) {
    return res.status(500).send("다시 시도해 주세요.");
  }
};
