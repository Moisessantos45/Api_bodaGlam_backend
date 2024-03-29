"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVerifyExistsData = exports.getDataConvert = exports.getRootDir = exports.genertaDate = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const meses = {
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
const genertaDate = () => {
    const date = new Date();
    const anio = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    const mes = meses[month];
    return `${mes} ${day}, ${anio}`;
};
exports.genertaDate = genertaDate;
const getRootDir = () => {
    const rootDirDev = path_1.default.resolve(__dirname, "..", "..");
    const rootDirProd = path_1.default.resolve(__dirname, "..", "..", "src");
    return fs_1.default.existsSync(path_1.default.join(__dirname, "..", "..", "build"))
        ? rootDirProd
        : rootDirDev;
};
exports.getRootDir = getRootDir;
const getDataConvert = (ruta) => {
    if (!fs_1.default.existsSync(ruta)) {
        return [];
    }
    const data = fs_1.default.readFileSync(ruta, "utf-8");
    return JSON.parse(data);
};
exports.getDataConvert = getDataConvert;
const getVerifyExistsData = (id, ruta) => __awaiter(void 0, void 0, void 0, function* () {
    const getData = yield getDataConvert(ruta);
    const verifyFilterPostById = getData.find((item) => item.id === id);
    if (verifyFilterPostById === undefined) {
        throw new Error("Data not found");
    }
    return verifyFilterPostById;
});
exports.getVerifyExistsData = getVerifyExistsData;
