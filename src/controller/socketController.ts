import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Reservation from "../model/Reservation";
import User from "../model/User";

interface Clients {
  socketId: string;
  userId: string;
}

let clients: Clients[] = [];

const socketController = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  io: Server<DefaultEventsMap, DefaultEventsMap>
) => {
  socket.on("login", async ({ user }) => {
    // 유저가 첫 로그인일 경우
    if (clients.findIndex((client) => client.userId === user) === -1) {
      clients.push({ socketId: socket.id, userId: user });
    } else {
      // 유저가 리프레쉬를 눌러 소켓아이디가 달라졌을 경우
      const index = clients.findIndex((client) => client.userId === user);
      clients.splice(index, 1);
      clients.push({ socketId: socket.id, userId: user });
    }
    // 유저가 로그인할 경우 해당 유저의 읽지 않은 지난 예약 목록 푸쉬 알림
    const reservation = await Reservation.find({
      read: false,
      guest: user,
    });
    const currentUser = await User.findById(user);
    if (reservation && currentUser) {
      const filtered = reservation.filter(
        (item) => item.checkOut.getTime() < new Date().getTime()
      );
      if (filtered.length > 0) {
        for (let i = 0; i < filtered.length; i++) {
          currentUser.unreadNotifications.push({ label: "reservation-past" });
        }
        io.to(socket.id).emit("notification");
        currentUser.save();
      }
    }
    console.log(clients);
  });

  socket.on("logout", ({ user }) => {
    clients = clients.filter((client) => client.userId !== user);
    console.log(clients);
  });

  socket.on("makeReservation", async ({ hostId, guestId }) => {
    const host = clients.find((client) => client.userId === hostId);
    // 호스트가 접속중인 경우 바로 알림 전송
    if (host) {
      io.to(host.socketId).emit("notification");
    }
    const hostData = await User.findById(hostId);
    hostData?.unreadNotifications.push({ label: "reservation-myRoom" });
    hostData?.save();
  });
};

export default socketController;
