import express from "express";
import dotenv from "dotenv";
import router from "./Routers";
import cors from "cors";

const app = express();
app.use(express.json());

dotenv.config();

const dominiosPermitidos = [process.env.URL_HOST_FRONTEND];
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

app.listen(PORT, () => {
  console.log(`servidor funcionando ${PORT}`);
});
