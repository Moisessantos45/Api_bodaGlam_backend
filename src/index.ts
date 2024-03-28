import express from "express";
import dotenv from "dotenv";
import router from "./Routers";

const app = express();
app.use(express.json());

dotenv.config();

app.use("/img", express.static("./public/img"));

app.use("/api/1.0", router);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`servidor funcionando ${PORT}`);
});

