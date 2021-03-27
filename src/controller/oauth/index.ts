import { Request, Response } from "express";
import User from "../../model/User";

export const postOauth = async (req: Request, res: Response) => {
  const { name, email, avatarUrl } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const newUser = await User.create({
        name,
        avatarUrl:
          avatarUrl || "/static/image/user/default_user_profile_image.jpg",
        email,
      });
      return res.status(200).send(newUser);
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).end();
  }
};
