import { Request, Response } from "express";
import Reservation from "../../model/Reservation";
import Review from "../../model/Review";
import Room from "../../model/Room";
import User from "../../model/User";

export const postReview = async (req: Request, res: Response) => {
  const {
    body: {
      body: { rating, text, reservation, isToGuest },
    },
  } = req;
  try {
    const currentReservation = await Reservation.findById(reservation);

    if (currentReservation) {
      if (isToGuest) {
        currentReservation.hostReviewed = true;
        currentReservation.save();
      } else {
        currentReservation.guestReviewed = true;
        currentReservation.save();
      }

      const guest = await User.findById(currentReservation.guest);
      const host = await User.findById(currentReservation.host);
      const room = await Room.findById(currentReservation.room);

      if (isToGuest) {
        if (host && guest) {
          const newReview = await Review.create({
            text,
            creator: host,
            room,
          });
          guest.reviewFromHost.push(newReview._id);
          guest.save();
          host.review.push(newReview._id);
          host.save();
          return res.status(200).end();
        } else {
          return res.status(404).send("존재하지 않는 게스트입니다.");
        }
      } else {
        if (host && guest && room) {
          const newReview = await Review.create({
            text,
            creator: guest,
            room,
          });
          guest.review.push(newReview._id);
          guest.save();
          host.reviewFromGuest.push(newReview._id);
          host.save();

          room.review.push(newReview);
          if (room.rating.length === 0) {
            room.rating = rating;
          } else {
            room.rating = room.rating.map((currentItem) => {
              rating.forEach((item: { label: string; value: number }) => {
                if (currentItem.label !== item.label) return;
                currentItem.value = Number(
                  (
                    (currentItem.value * (room.review.length - 1) +
                      item.value) /
                    room.review.length
                  ).toFixed(2)
                );
              });
              return { label: currentItem.label, value: currentItem.value };
            });
          }
          let sum = 0;
          room.rating.forEach((item: { label: string; value: number }) => {
            sum += item.value;
          });
          room.avgOfRating = Number((sum / 6).toFixed(2));
          room.save();
          return res.status(200).end();
        } else {
          return res.status(404).send("존재하지 않는 숙소입니다.");
        }
      }
    } else {
      return res.status(404).send("존재하지 않는 예약입니다.");
    }
  } catch (error) {
    return res.status(500).end();
  }
};
