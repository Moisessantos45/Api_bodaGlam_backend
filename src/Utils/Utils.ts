import path from "path";
import fs from "fs";

// const meses = {
//   1: "enero",
// };

// const genertaDate = (): string => {
//   const date = new Date();
//   const anio = date.getFullYear();
//   const month = date.getMonth() + 1;
//   const day = date.getDay();
//   const mes = meses[month];
//   return `${mes} ${day}, ${anio}`;
// };

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

export { getRootDir, getDataConvert };
