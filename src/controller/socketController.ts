import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
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
    console.log(clients);
  });

  socket.on("logout", ({ user }) => {
    clients = clients.filter((client) => client.userId !== user);
    console.log(clients);
  });

  socket.on("makeReservation", async ({ hostId, guestId }) => {
    const host = clients.find((client) => client.userId === hostId);
    const guest = clients.find((client) => client.userId === guestId);
    // 호스트가 접속중인 경우 바로 알림 전송
    if (host) {
      io.to(host.socketId).emit("notification");
    }
    const hostData = await User.findById(hostId);
    hostData?.unreadNotifications.push({ label: "reservation-myRoom" });
    hostData?.save();
    const guestData = await User.findById(guestId);
    setTimeout(() => {
      if (guest) {
        io.to(guest.socketId).emit("notification");
      }
      guestData?.unreadNotifications.push({ label: "reservation-past" });
      guestData?.save();
    }, 5000);
  });
};

export default socketController;
