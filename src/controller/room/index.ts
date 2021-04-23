import { Request, Response } from "express";
import aws from "aws-sdk";
import Room from "../../model/Room";
import User from "../../model/User";
import { IReview } from "../../types/review";

export const getRoom = async (req: Request, res: Response) => {
  const {
    query: { page, limit = "6" },
  } = req;
  try {
    const room = await Room.findById(req.params.id)
      .populate({
        path: "creator",
        model: "User",
      })
      .populate({
        path: "review",
        model: "Review",
        populate: {
          path: "creator",
          model: "User",
        },
        options: {
          sort: "-createdAt",
        },
      });
    if (room) {
      // 리뷰 더보기 페이지
      if (page) {
        const spliced = room.review.splice(
          (Number(page) - 1) * Number(limit),
          Number(limit)
        );
        return res.status(200).send(spliced);
      }
      return res.status(200).send(room);
    } else {
      return res.status(404).send("존재하지 않는 숙소입니다.");
    }
  } catch (error) {
    return res.status(500).send("숙소를 불러오는 데 실패했습니다.");
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
    return res.status(204).end();
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
    query: { userId },
  } = req;
  try {
    const currentRoom = await Room.findById(id);
    if (currentRoom?.creator.toString() !== userId?.toString()) {
      return res.status(403).send("승인되지 않은 요청입니다.");
    }
    const creator = await User.findById(userId).populate("reviewFromGuest");
    if (creator) {
      const index = creator.rooms.findIndex((room: object) => {
        return room.toString() === id?.toString();
      });
      creator.rooms.splice(index, 1);
      creator.reviewFromGuest = creator.reviewFromGuest.filter(
        (review: IReview) => {
          return review.room.toString() !== id;
        }
      );
      creator.save();
    } else {
      return res.status(404).send("로그인이 필요한 서비스입니다.");
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

    return res.status(204).end();
  } catch (error) {
    return res
      .status(500)
      .send("숙소 삭제에 실패하였습니다. 다시 시도해 주세요.");
  }
};
