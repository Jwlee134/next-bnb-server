import { Request, Response } from "express";
import User from "../../model/User";

export const getReview = async (req: Request, res: Response) => {
  const {
    query: { id, page, limit = "5", value },
  } = req;
  try {
    const user = await User.findById(id)
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
        populate: { path: "room", model: "Room" },
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
      if (value === "guest") {
        const splicedGuest = user.reviewFromGuest.splice(
          (Number(page) - 1) * Number(limit),
          Number(limit)
        );
        return res.status(200).send(splicedGuest);
      } else {
        const splicedHost = user.reviewFromHost.splice(
          (Number(page) - 1) * Number(limit),
          Number(limit)
        );
        return res.status(200).send(splicedHost);
      }
    }
  } catch (error) {
    return res.status(404).send("존재하지 않는 사용자입니다.");
  }
};
