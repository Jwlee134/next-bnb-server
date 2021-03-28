import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const socketController = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  console.log("a user connected");
  socket.on("init", (data) => {
    console.log(data);
    socket.emit("welcome", `hello ${data.name}`);
  });
};

export default socketController;
