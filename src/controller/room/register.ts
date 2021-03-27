import { Request, Response } from "express";
import Room from "../../model/Room";
import User from "../../model/User";

export const postRegisterRoom = async (req: Request, res: Response) => {
  try {
    const {
      body: { body },
      headers: { user },
    } = req;
    const currentUser = await User.findById(user);
    if (currentUser) {
      const newRoom = await Room.create({
        ...body,
        creator: user,
      });
      currentUser.rooms.push(newRoom._id);
      currentUser.save();
      return res.status(200).send(newRoom);
    } else {
      return res.status(404).send("로그인이 필요한 서비스입니다.");
    }
  } catch (error) {
    return res
      .status(500)
      .send("숙소 등록에 실패하였습니다. 다시 시도해 주세요.");
  }
};
