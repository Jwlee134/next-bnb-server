import { Request, Response } from "express";
import aws from "aws-sdk";
import User from "../../model/User";

export const getUser = async (req: Request, res: Response) => {
  const {
    query: { id },
  } = req;
  try {
    const user = await User.findById(id).populate({
      path: "rooms",
      model: "Room",
    });

    if (user) {
      return res.status(200).send(user);
    }
  } catch (error) {
    return res.status(404).send("존재하지 않는 사용자입니다.");
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESSKEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESSKEY_ID,
  });
  const {
    body: { avatarUrl, text, user, currentUser },
  } = req;
  if (currentUser !== user) return res.status(400).end();
  try {
    const userData = await User.findById(user);
    if (userData) {
      if (text) {
        userData.introduction = text;
      }
      if (avatarUrl) {
        if (userData.avatarUrl.includes("amazon")) {
          const key = userData.avatarUrl.split("/avatar/")[1];
          s3.deleteObject(
            {
              Bucket: `${process.env.S3_BUCKET_NAME!}/avatar`,
              Key: key as string,
            },
            (err) => {
              if (err) {
                return res.status(500).send("다시 시도해 주세요.");
              }
            }
          );
        }
        userData.avatarUrl = avatarUrl;
      }
      userData.save();
      return res.status(204).end();
    }
  } catch (error) {
    return res.status(404).send("존재하지 않는 사용자입니다.");
  }
};
