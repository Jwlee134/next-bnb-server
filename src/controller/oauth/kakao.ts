import axios from "axios";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../../model/User";

export const postKakao = async (req: Request, res: Response) => {
  const { code } = req.query;
  try {
    const { data } = await axios({
      url: "https://kauth.kakao.com/oauth/token",
      method: "post",
      params: {
        client_id: process.env.KAKAO_REST_API_KEY,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
        redirect_uri: `${
          process.env.NODE_ENV === "development"
            ? process.env.BASE_URL
            : process.env.BASE_URL_PROD
        }/oauth/kakao`,
        code,
        grant_type: "authorization_code",
      },
    });
    const { data: user } = await axios.get(
      "https://kapi.kakao.com/v2/user/me",
      {
        headers: { Authorization: `Bearer ${data.access_token}` },
      }
    );
    const {
      properties: { profile_image: avatarUrl },
      kakao_account: {
        email,
        profile: { nickname: name },
      },
    } = user;
    const currentUser = await User.findOne({ email });
    let token;
    let userObj;
    if (!currentUser) {
      const newUser = await User.create({
        name,
        avatarUrl:
          avatarUrl || "/static/image/user/default_user_profile_image.jpg",
        email: email || "",
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
    console.log(error);
    res.status(500).end();
  }
};
