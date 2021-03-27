import { Request, Response } from "express";
import Room from "../../model/Room";
import User from "../../model/User";
import { IRoom } from "../../types/room";

export const getManagement = async (req: Request, res: Response) => {
  const { user: id } = req.headers;
  const { sortBy, order, term } = req.query;
  const filter = { $regex: term || "", $options: "i" };

  try {
    const data = await User.findById(id).populate({
      path: "rooms",
      model: Room,
      match: {
        $or: [
          { title: filter },
          { country: filter },
          { province: filter },
          { city: filter },
        ],
      },
    });

    if (data) {
      if (order === "asc") {
        if (sortBy === "title" || sortBy === "country") {
          data.rooms.sort();
          return res.status(200).send(data.rooms);
        }
        data.rooms.sort((a: IRoom, b: IRoom) => {
          return +a[sortBy as string] - +b[sortBy as string];
        });
        return res.status(200).send(data.rooms);
      }

      if (sortBy === "title" || sortBy === "country") {
        data.rooms.reverse();
        return res.status(200).send(data.rooms);
      }

      data.rooms.sort((a: IRoom, b: IRoom) => {
        return +b[sortBy as string] - +a[sortBy as string];
      });
      return res.status(200).send(data.rooms);
    } else {
      return res.status(404).send("로그인이 필요한 서비스입니다.");
    }
  } catch (error) {
    return res.status(500).end();
  }
};
