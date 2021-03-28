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
    if (clients.findIndex((client) => client.userId === user) === -1) {
      clients.push({ socketId: socket.id, userId: user });
      const userData = await User.findById(user);
      if (userData?.reservationRequest.length !== 0) {
        io.to(socket.id).emit(
          "reservationRequest",
          userData?.reservationRequest
        );
        userData?.reservationRequest.splice(0);
        userData?.save();
      }
      console.log(clients);
    }
  });

  socket.on("logout", ({ user }) => {
    clients = clients.filter((client) => client.userId !== user);
    console.log(clients);
  });

  socket.on(
    "sendReservationRequest",
    async ({ roomId, hostId, guestId, checkIn, checkOut, guestCount }) => {
      const host = clients.find((client) => client.userId === hostId);
      const guest = clients.find((client) => client.userId === guestId);
      const requestForm = {
        roomId,
        guestId: (guest as Clients).userId,
        checkIn,
        checkOut,
        guestCount,
      };
      if (!host) {
        const hostData = await User.findById(hostId);
        hostData?.reservationRequest.push(requestForm);
        hostData?.save();
        return;
      }
      io.to(host.socketId).emit("reservationRequest", requestForm);
    }
  );
};

export default socketController;
