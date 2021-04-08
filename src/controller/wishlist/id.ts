import { Request, Response } from "express";
import User from "../../model/User";
import Wishlist from "../../model/Wishlist";

export const getOneWishlist = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;
  try {
    const data = await Wishlist.findById(id).populate({
      path: "list",
      model: "Room",
    });
    if (data) {
      return res.status(200).send(data);
    } else {
      return res.status(404).send("존재하지 않는 위시리스트입니다.");
    }
  } catch (error) {
    return res.status(500).send("위시리스트를 불러올 수 없습니다.");
  }
};

export const updateOneWishlist = async (req: Request, res: Response) => {
  const {
    body: { title },
    params: { id },
  } = req;
  try {
    const data = await Wishlist.findById(id).populate({
      path: "list",
      model: "Room",
    });
    if (data) {
      data.title = title;
      data.save();
      return res.status(200).send(data);
    } else {
      return res.status(404).send("존재하지 않는 위시리스트입니다.");
    }
  } catch (error) {
    return res.status(500).send("다시 시도해 주세요.");
  }
};

export const deleteOneWishlist = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await Wishlist.findByIdAndDelete(id);
    if (data) {
      const user = await User.findById(data.creator);
      if (user) {
        const index = user.wishlist.findIndex(
          (list: object) => list.toString() === data._id.toString()
        );
        user.wishlist.splice(index, 1);
        user.save();
        return res.status(200).end();
      } else {
        return res.status(404).send("로그인이 필요한 서비스입니다.");
      }
    } else {
      return res.status(404).send("존재하지 않는 위시리스트입니다.");
    }
  } catch (error) {
    return res.status(500).send("다시 시도해 주세요.");
  }
};
