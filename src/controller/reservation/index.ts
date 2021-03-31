import { Request, Response } from "express";
import Reservation from "../../model/Reservation";
import Room from "../../model/Room";
import User from "../../model/User";
import { IReservation } from "../../types/reservation";

export const getReservation = async (req: Request, res: Response) => {
  const {
    query: { keyword },
    headers: { user },
  } = req;
  try {
    if (keyword) {
      const currentUser = await User.findById(user);
      if (currentUser) {
        currentUser.unreadNotifications = currentUser.unreadNotifications.filter(
          (notif) => !notif.label.includes(keyword as string)
        );
        currentUser.save();
      } else {
        return res.status(404).send("로그인이 필요한 서비스입니다.");
      }
    }
    let reservations: IReservation[], filtered: IReservation[];
    switch (keyword) {
      case "myRoom":
        reservations = await Reservation.find({ host: user })
          .populate({
            path: "room",
            model: Room,
          })
          .populate({
            path: "guest",
            model: User,
          })
          .sort("-checkIn");
        return res.status(200).send(reservations);
      case "past":
        reservations = await Reservation.find({
          guest: user,
        })
          .populate({
            path: "room",
            model: Room,
          })
          .sort("-checkIn");
        for (const reservation of reservations) {
          if (reservation.read) return;
          reservation.read = true;
          reservation.save();
        }
        filtered = reservations.filter((reservation) => {
          return reservation.checkOut.getTime() < new Date().getTime();
        });
        return res.status(200).send(filtered);
      default:
        reservations = await Reservation.find({
          guest: user,
        })
          .populate({
            path: "room",
            model: Room,
          })
          .sort("-checkIn");
        filtered = reservations.filter((reservation) => {
          return reservation.checkOut.getTime() > new Date().getTime();
        });
        return res.status(200).send(filtered);
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
        host: room.creator,
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
