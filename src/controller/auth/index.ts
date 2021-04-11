import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/User";

export const postLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
    if (!user.password) {
      return res.status(400).send("소셜 계정으로 이미 가입된 이메일입니다.");
    }

    const correctPassword = bcrypt.compareSync(password, user.password);

    if (!correctPassword) {
      return res.status(404).send("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    const token = jwt.sign(user.id, process.env.JWT_SECRET_KEY!);

    res.cookie("access_token", token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 3),
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
    });

    return res.status(200).send({ ...user.toObject(), isLoggedIn: true });
  } catch (error) {
    return res.status(500).end();
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (req.cookies) {
      const { access_token: token } = req.cookies;
      // 첨부된 토큰을 가져와 복호화
      if (token) {
        const userId = jwt.verify(token, process.env.JWT_SECRET_KEY!);

        const user = await User.findById(userId);

        if (user) {
          return res.status(200).send({ ...user.toObject(), isLoggedIn: true });
        } else {
          return res.status(404).send("존재하지 않는 사용자입니다.");
        }
      }
    }
  } catch (error) {
    return res.status(500).end();
  }
  return res.json({ isLoggedIn: false });
};

export const postSignUp = async (req: Request, res: Response) => {
  const { name, email, password, birthday } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(409).send("이미 가입된 이메일입니다.");

    const hash = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hash,
      birthday,
      avatarUrl: "/static/image/user/default_user_profile_image.jpg",
    });

    const token = jwt.sign(newUser.id, process.env.JWT_SECRET_KEY!);

    res.cookie("access_token", token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 3),
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
    });

    return res.status(200).send({ ...newUser.toObject(), isLoggedIn: true });
  } catch (error) {
    return res.status(500).end();
  }
};

export const postLogout = async (req: Request, res: Response) => {
  return res
    .clearCookie("access_token", {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({ isLoggedIn: false });
};
