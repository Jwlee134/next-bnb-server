import { Request, Response } from "express";
import Reservation from "../../model/Reservation";
import Review from "../../model/Review";
import Room from "../../model/Room";
import User from "../../model/User";

export const postReview = async (req: Request, res: Response) => {
  const {
    body: {
      body: { rating, text, reservation },
    },
  } = req;

  try {
    const currentReservation = await Reservation.findById(reservation);
    if (currentReservation) {
      currentReservation.reviewed = true;
      currentReservation.save();
      const currentUser = await User.findById(currentReservation.guest);
      const currentRoom = await Room.findById(currentReservation.room);
      if (currentUser) {
        const newReview = await Review.create({
          text,
          creator: currentUser,
        });
        currentUser.review.push(newReview._id);
        currentUser.save();
        if (currentRoom) {
          currentRoom.review.push(newReview);
          if (currentRoom.rating.length === 0) {
            currentRoom.rating = rating;
          } else {
            currentRoom.rating = currentRoom.rating.map((currentItem) => {
              rating.forEach((item: { label: string; value: number }) => {
                if (currentItem.label !== item.label) return;
                currentItem.value = Number(
                  (
                    (currentItem.value * (currentRoom.review.length - 1) +
                      item.value) /
                    currentRoom.review.length
                  ).toFixed(2)
                );
              });
              return { label: currentItem.label, value: currentItem.value };
            });
          }
          let sum = 0;
          currentRoom.rating.forEach(
            (item: { label: string; value: number }) => {
              sum += item.value;
            }
          );
          currentRoom.avgOfRating = Number((sum / 6).toFixed(2));
          currentRoom.save();
          return res.status(200).end();
        } else {
          return res.status(404).send("존재하지 않는 숙소입니다.");
        }
      } else {
        return res.status(404).send("로그인이 필요한 서비스입니다.");
      }
    } else {
      return res.status(404).send("존재하지 않는 예약입니다.");
    }
  } catch (error) {
    return res.status(500).end();
  }
};
