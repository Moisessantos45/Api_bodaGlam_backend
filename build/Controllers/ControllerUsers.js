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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.deleteUser = exports.updateUser = exports.registerUser = exports.loginUserAutheticate = exports.getUserById = exports.getUsers = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const GenerateJwt_1 = __importDefault(require("../Helper/GenerateJwt"));
const Utils_1 = require("../Utils/Utils");
const Errors_1 = require("../Err/Errors");
const uuid_1 = require("uuid");
const EncrypPassword_1 = require("../Helper/EncrypPassword");
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
        const existsUser = getUserData.find((item) => item.email === email);
        if (existsUser === undefined) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        const existsPassword = yield (0, EncrypPassword_1.comparePassword)(password, existsUser.password);
        if (!existsPassword) {
            res.status(401).json({ msg: "Invalid password" });
            return;
        }
        const token = (0, GenerateJwt_1.default)(existsUser.id);
        const newUser = Object.assign(Object.assign({}, existsUser), { token, active: true });
        const newUserData = getUserData.map((item) => item.id === newUser.id ? newUser : item);
        fs_1.default.writeFileSync(getPath(), JSON.stringify(newUserData, null, 2));
        const { password: omitPassword } = newUser, rest = __rest(newUser, ["password"]);
        res.status(200).json(rest);
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
exports.loginUserAutheticate = loginUserAutheticate;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const getUserData = yield (0, Utils_1.getDataConvert)(getPath());
        const existsUser = getUserData.find((item) => item.email === email);
        if (existsUser !== undefined) {
            res.status(401).json({ message: "User already exists" });
            return;
        }
        const _a = req.body, { password: _ } = _a, rest = __rest(_a, ["password"]);
        const passwordHas = yield (0, EncrypPassword_1.encrypPassword)(password);
        const id = (0, uuid_1.v4)();
        const token = "";
        const active = false;
        const newUser = Object.assign({ id, password: passwordHas, token,
            active }, rest);
        getUserData.push(newUser);
        fs_1.default.writeFileSync(getPath(), JSON.stringify(getUserData, null, 2));
        res.status(201).json({ msg: "User created successfully" });
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
exports.registerUser = registerUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getUserData = yield (0, Utils_1.getDataConvert)(getPath());
        const existsUser = getUserData.find((item) => item.id === id);
        if (existsUser === undefined) {
            res.status(401).json({ msg: "User not found" });
            return;
        }
        const dataUserReq = req.body;
        let verifyUpdate = false;
        for (const key in dataUserReq) {
            if (dataUserReq[key] !== existsUser[key]) {
                verifyUpdate = true;
                if (key === "password") {
                    if (dataUserReq[key].trim() !== "") {
                        const passwordHas = yield (0, EncrypPassword_1.encrypPassword)(dataUserReq[key]);
                        existsUser[key] = passwordHas;
                    }
                }
                else if (key === "active") {
                    existsUser[key] = JSON.parse(dataUserReq[key]);
                }
                else {
                    existsUser[key] = dataUserReq[key];
                }
            }
        }
        if (!verifyUpdate) {
            res.status(200).json({ msg: "There were no updated data" });
            return;
        }
        const newDataPost = getUserData.map((item) => item.id === id ? existsUser : item);
        fs_1.default.writeFileSync(getPath(), JSON.stringify(newDataPost, null, 2));
        res.status(200).json({ msg: "User updated successfully" });
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
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getUserData = yield (0, Utils_1.getDataConvert)(getPath());
        const existsUser = getUserData.find((item) => item.id === id);
        if (existsUser === undefined) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        const newUser = getUserData.filter((item) => item.id !== id);
        fs_1.default.writeFileSync(getPath(), JSON.stringify(newUser, null, 2));
        res.status(200).json({ msg: "User deleted successfully" });
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
exports.deleteUser = deleteUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { email } = req.body;
    try {
        const getUserData = yield (0, Utils_1.getDataConvert)(getPath());
        const existsUser = getUserData.find((item) => item.id === id && item.email === email);
        if (existsUser === undefined) {
            res.status(401).json({ msg: "User not found" });
            return;
        }
        const newUser = getUserData.map((item) => item.id === id ? Object.assign(Object.assign({}, item), { token: "", active: false }) : item);
        fs_1.default.writeFileSync(getPath(), JSON.stringify(newUser, null, 2));
        res.status(200).json({ msg: "User logout successfully" });
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
exports.logoutUser = logoutUser;
