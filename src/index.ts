import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import router from "./router";
import "./db";
import socketController from "./controller/socketController";

const app = express();

const port = process.env.PORT || 8000;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello EC2!");
});

app.use("/api", router);

const httpServer = http.createServer(app).listen(port, () => {
  console.log(`> Server listening at http://localhost:${port}`);
});

const io = new Server(httpServer, {
  cors: { origin: "*" },
  transports: ["polling"],
});

io.on("connection", (socket) => {
  socketController(socket, io);
});
