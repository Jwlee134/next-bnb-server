"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mongoose_1.default.connect(process.env.NODE_ENV === "production"
    ? process.env.MONGO_URL_PROD
    : process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
var db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("> Connected on DB");
});
//# sourceMappingURL=db.js.map