import axios from "axios";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../../model/User";

export const postGoogle = async (req: Request, res: Response) => {
  const { code } = req.query;
  try {
    const { data } = await axios({
      url: "https://oauth2.googleapis.com/token",
      method: "post",
      params: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${
          process.env.NODE_ENV === "development"
            ? process.env.BASE_URL
            : process.env.BASE_URL_PROD
        }/oauth/google`,
        code,
        grant_type: "authorization_code",
      },
    });
    const { data: user } = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${data.access_token}`
    );
    const currentUser = await User.findOne({ email: user.email });
    let token;
    let userObj;
    if (!currentUser) {
      const newUser = await User.create({
        name: user.name,
        avatarUrl:
          user.picture || "/static/image/user/default_user_profile_image.jpg",
        email: user.email,
      });
      token = jwt.sign(newUser.id, process.env.JWT_SECRET_KEY!);
      userObj = { ...newUser.toObject(), isLoggedIn: true };
    } else {
      token = jwt.sign(currentUser.id, process.env.JWT_SECRET_KEY!);
      userObj = { ...currentUser.toObject(), isLoggedIn: true };
    }
    return res
      .cookie("access_token", token, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 3),
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .send(userObj);
  } catch (error) {
    res.status(500).end();
  }
};
