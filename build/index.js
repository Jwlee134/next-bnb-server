"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var socket_io_1 = require("socket.io");
var router_1 = __importDefault(require("./router"));
require("./db");
var socketController_1 = __importDefault(require("./controller/socketController"));
dotenv_1.default.config();
var app = express_1.default();
var port = process.env.PORT || 8000;
app.use(cors_1.default({
    origin: true,
    credentials: true,
}));
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.get("/", function (req, res) {
    res.send("Hello Beanstalk!");
});
app.use("/api", router_1.default);
var httpServer = http_1.default.createServer(app).listen(port, function () {
    console.log("> Server listening at http://localhost:" + port);
});
var io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*" },
    transports: ["polling"],
});
io.on("connection", function (socket) {
    socketController_1.default(socket, io);
});
//# sourceMappingURL=index.js.map