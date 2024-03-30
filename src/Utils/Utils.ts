import path from "path";
import fs from "fs";
import { Post, User } from "../Types/types";

const meses: { [key: number]: string } = {
  1: "enero",
  2: "febrero",
  3: "marzo",
  4: "abril",
  5: "mayo",
  6: "junio",
  7: "julio",
  8: "agosto",
  9: "septiembre",
  10: "octubre",
  11: "noviembre",
  12: "diciembre",
};

const genertaDate = (): string => {
  const date = new Date();
  const anio = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDay();
  const mes = meses[month];
  return `${mes} ${day}, ${anio}`;
};

const getRootDir = () => {
  const rootDirDev = path.resolve(__dirname, "..", "..");
  const rootDirProd = path.resolve(__dirname, "..", "..", "src");
  return fs.existsSync(path.join(__dirname, "..", "..", "build"))
    ? rootDirProd
    : rootDirDev;
};

const getPath = (file: string) => {
  const rootDir = getRootDir();
  const pathJson = path.join(rootDir, "db", `${file}.json`);
  return pathJson;
};

const getDataConvert = (ruta: string) => {
  if (!fs.existsSync(ruta)) {
    return [];
  }
  const data = fs.readFileSync(ruta, "utf-8");
  return JSON.parse(data);
};

const getVerifyExistsData = async (id: string, ruta: string) => {
  const getData = await getDataConvert(ruta);
  const verifyFilterPostById = getData.find(
    (item: Post | User) => item.id === id
  );
  if (verifyFilterPostById === undefined) {
    throw new Error("Data not found");
  }
  return verifyFilterPostById;
};

export {
  getPath,
  genertaDate,
  getRootDir,
  getDataConvert,
  getVerifyExistsData,
};
