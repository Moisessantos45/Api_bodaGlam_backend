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
exports.getUserById = exports.getUsers = void 0;
const path_1 = __importDefault(require("path"));
const Utils_1 = require("../Utils/Utils");
const Errors_1 = require("../Err/Errors");
const getPath = () => {
    const rootDir = (0, Utils_1.getRootDir)();
    const pathJson = path_1.default.join(rootDir, "db", "users.json");
    return pathJson;
};
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUsersData = yield (0, Utils_1.getDataConvert)(getPath());
        res.status(202).json(getUsersData);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, Errors_1.sendErrors)(res, error.message, 501);
        }
        else {
            (0, Errors_1.sendErrors)(res, "An unexpected error occurred", 501);
        }
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getUserByIdData = yield (0, Utils_1.getVerifyExistsData)(id, getPath());
        res.status(200).json(getUserByIdData);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, Errors_1.sendErrors)(res, error.message, 501);
        }
        else {
            (0, Errors_1.sendErrors)(res, "An unexpected error occurred", 501);
        }
    }
});
exports.getUserById = getUserById;
const loginUserAutheticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const getUserData = yield (0, Utils_1.getDataConvert)(getPath());
        const existsUser = getUserData.find((item) => item.email === email && item.password === password);
        if (!existsUser) {
            res.status(401).json({ message: "User not found" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            (0, Errors_1.sendErrors)(res, error.message, 501);
        }
        else {
            (0, Errors_1.sendErrors)(res, "An unexpected error occurred", 501);
        }
    }
});
