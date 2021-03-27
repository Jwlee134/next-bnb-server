import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import router from "./router";
import "./db";

dotenv.config();

const app = express();

const port = 8000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`> Server listening at http://localhost:${port}`);
});
