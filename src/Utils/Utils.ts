import path from "path";
import fs from "fs";
import { Post, User } from "../Types/types";

const meses: { [key: number]: string } = {
  1: "enero",
  2: "febrero",
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

const getDataConvert = (ruta: string) => {
  if (!fs.existsSync(ruta)) {
    return [];
  }
  const data = fs.readFileSync(ruta, "utf-8");
  return JSON.parse(data);
};

const getVerifyExistsData = async (id: string, ruta: string) => {
  const getData = await getDataConvert(ruta);
  const verifyFilterPostById = getData.filter(
    (item: Post | User) => item.id === id
  );
  if (verifyFilterPostById.length === 0) {
    throw new Error("Data not found");
  }
  return verifyFilterPostById;
};

export { genertaDate, getRootDir, getDataConvert, getVerifyExistsData };
