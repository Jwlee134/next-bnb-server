import { Request, Response } from "express";
import User from "../../model/User";

export const getUser = async (req: Request, res: Response) => {
  const {
    query: { id },
  } = req;
  try {
    const user = await User.findById(id)
      .populate({ path: "rooms", model: "Room" })
      .populate({
        path: "review",
        model: "Review",
        options: {
          sort: "-createdAt",
        },
      })
      .populate({
        path: "reviewFromHost",
        model: "Review",
        populate: { path: "creator", model: "User" },
        options: {
          sort: "-createdAt",
        },
      })
      .populate({
        path: "reviewFromGuest",
        model: "Review",
        populate: { path: "creator", model: "User" },
        options: {
          sort: "-createdAt",
        },
      });
    if (user) {
      return res.status(200).send(user);
    }
  } catch (error) {
    return res.status(404).send("존재하지 않는 사용자입니다.");
  }
};
