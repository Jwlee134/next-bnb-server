import mongoose from "mongoose";

mongoose.connect(
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URL_PROD!
    : process.env.MONGO_URL!,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("> Connected on DB");
});
