import { Request, Response } from "express";
import aws from "aws-sdk";
import Room from "../../model/Room";
import User from "../../model/User";
import Wishlist from "../../model/Wishlist";
import { IWishlist } from "../../types/user";

export const getRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id).populate("creator");
    res.status(200).send(room);
  } catch (error) {
    res.status(404).send("존재하지 않는 숙소입니다.");
  }
};

export const postRoom = async (req: Request, res: Response) => {
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
      res.status(404).send("로그인이 필요한 서비스입니다.");
    }
  } catch (error) {
    return res
      .status(500)
      .send("숙소 등록에 실패하였습니다. 다시 시도해 주세요.");
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  const {
    params: { id },
    body: { body: room },
  } = req;
  try {
    await Room.findByIdAndUpdate(id, {
      ...room,
      updatedAt: new Date(),
    });
    return res.status(200).end();
  } catch (error) {
    return res
      .status(500)
      .send("숙소 수정에 실패하였습니다. 다시 시도해 주세요.");
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESSKEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESSKEY_ID,
  });
  const {
    params: { id },
    headers: { user },
  } = req;
  try {
    const creator = await User.findById(user).populate("wishlist");
    if (creator) {
      const index = creator.rooms.findIndex((room: object) => {
        return room.toString() === id?.toString();
      });
      creator.rooms.splice(index, 1);
      creator.save();
    } else {
      return res.status(404).send("로그인이 필요한 서비스입니다.");
    }

    const wishlistId = creator.wishlist.find((list: IWishlist) => {
      return list.list.includes(id);
    })._id;
    const wishlist = await Wishlist.findById(wishlistId);
    if (wishlist) {
      const wishlistIndex = wishlist.list.findIndex(
        (list: object) => list.toString() === id?.toString()
      );
      wishlist.list.splice(wishlistIndex, 1);
      wishlist.save();
    } else {
      return res.status(404).send("존재하지 않는 숙소입니다.");
    }

    const data = await Room.findByIdAndDelete(id);

    if (data) {
      await Promise.all(
        data.photos.map(async (photo) => {
          const key = photo.split("/room/")[1];
          s3.deleteObject(
            {
              Bucket: `${process.env.S3_BUCKET_NAME!}/room`,
              Key: key,
            },
            (err, data) => {
              if (err) console.log(err);
              else return data;
            }
          );
        })
      );
    }

    return res.status(200).end();
  } catch (error) {
    return res
      .status(500)
      .send("숙소 삭제에 실패하였습니다. 다시 시도해 주세요.");
  }
};
