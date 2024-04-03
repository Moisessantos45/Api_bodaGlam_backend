"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Routers_1 = __importDefault(require("./Routers"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const dominiosPermitidos = [
    process.env.URL_HOST_FRONTEND,
    process.env.URL_HOST_FRONTEND_ASTRO,
];
const opciones = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    },
};
app.use((0, cors_1.default)(opciones));
app.use("/img", express_1.default.static("./public/img"));
app.use("/api/1.0", Routers_1.default);
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`servidor funcionando ${PORT}`);
});
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: function (origin, callback) {
            if (dominiosPermitidos.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        },
    },
});
io.on("connection", (socket) => {
    socket.on("conexion", (url) => {
        console.log("si funciono");
        socket.join(url);
    });
});
