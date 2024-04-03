import express from "express";
import dotenv from "dotenv";
import router from "./Routers";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(express.json());

dotenv.config();

const dominiosPermitidos = [
  process.env.URL_HOST_FRONTEND,
  process.env.URL_HOST_FRONTEND_ASTRO,
];
const opciones = {
  origin: function (origin: any, callback: Function) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

app.use(cors(opciones));

app.use("/img", express.static("./public/img"));

app.use("/api/1.0", router);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`servidor funcionando ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: function (origin: any, callback: Function) {
      if (dominiosPermitidos.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
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
