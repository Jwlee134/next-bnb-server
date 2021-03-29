import { Request, Response } from "express";
import Reservation from "../../model/Reservation";
import Room from "../../model/Room";
import User from "../../model/User";

export const getReservation = async (req: Request, res: Response) => {
  const {
    query: { keyword },
    headers: { user },
  } = req;
  try {
    if (keyword) {
      const reservation = await Reservation.find()
        .populate({
          path: "room",
          model: Room,
          match: {
            creator: user,
          },
        })
        .populate({
          path: "guest",
          model: User,
        });
      const currentUser = await User.findById(user);
      if (currentUser) {
        currentUser.unreadNotifications = currentUser.unreadNotifications.filter(
          (notif) => !notif.label.includes(keyword as string)
        );
        currentUser.save();
      } else {
        return res.status(404).send("존재하지 않는 사용자입니다.");
      }
      return res.status(200).send(reservation);
    } else {
      const reservation = await Reservation.find({ guest: user }).populate({
        path: "room",
        model: Room,
      });
      return res.status(200).send(reservation);
    }
  } catch (error) {
    return res.status(500).end();
  }
};

export const postReservation = async (req: Request, res: Response) => {
  try {
    const {
      body: { checkIn, checkOut, guestCount, roomId, guestId, price },
    } = req.body;
    const room = await Room.findById(roomId);
    const guest = await User.findById(guestId);
    if (room && guest) {
      await Reservation.create({
        checkIn,
        checkOut,
        guestCount,
        price,
        room: room._id,
        guest: guest._id,
      });
      room.blockedDayList.push(checkIn);
      room.blockedDayList.push(checkOut);
      room.save();
      return res.status(204).end();
    } else {
      return res.status(404).send("존재하지 않는 숙소입니다.");
    }
  } catch (error) {
    return res.status(500).end();
  }
};
