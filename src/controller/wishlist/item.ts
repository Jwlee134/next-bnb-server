import { Request, Response } from "express";
import Wishlist from "../../model/Wishlist";
import { IRoom } from "../../types/room";

export const postItem = async (req: Request, res: Response) => {
  const { roomId, listId } = req.body;
  try {
    const wishlist = await Wishlist.findById(listId);
    if (wishlist) {
      wishlist.list.push(roomId);
      wishlist.save();
      return res.status(204).end();
    } else {
      return res.status(404).send("존재하지 않는 위시리스트입니다.");
    }
  } catch (error) {
    return res.status(500).send("다시 시도해 주세요.");
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  const { roomId, listId } = req.query;
  try {
    const wishlist = await Wishlist.findById(listId).populate({
      path: "list",
      model: "Room",
    });
    if (wishlist) {
      wishlist.list = wishlist.list.filter((item: IRoom) => {
        return item.id !== roomId;
      });
      wishlist.save();
      return res.status(200).send(wishlist);
    } else {
      return res.status(404).send("존재하지 않는 위시리스트입니다.");
    }
  } catch (error) {
    return res.status(500).send("다시 시도해 주세요.");
  }
};
