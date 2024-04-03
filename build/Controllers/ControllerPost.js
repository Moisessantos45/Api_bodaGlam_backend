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
exports.deletePost = exports.changeStatusPost = exports.updatePost = exports.postPost = exports.getPostByIdUser = exports.getPostById = exports.getPost = void 0;
const fs_1 = __importDefault(require("fs"));
const Utils_1 = require("../Utils/Utils");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Errors_1 = require("../Err/Errors");
// const getPath = () => {
//   const rootDir = getRootDir();
//   const pathJson = path.join(rootDir, "db", "data.json");
//   return pathJson;
// };
const pathFile = "data";
const getPost = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fs_1.default.existsSync((0, Utils_1.getPath)(pathFile))) {
            res.status(404).json({ msg: "Post not found" });
            return;
        }
        const getPostData = yield (0, Utils_1.getDataConvert)((0, Utils_1.getPath)(pathFile));
        res.status(202).json(getPostData);
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
exports.getPost = getPost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const filterPostById = yield (0, Utils_1.getVerifyExistsData)(id, (0, Utils_1.getPath)(pathFile));
        res.status(200).json(filterPostById);
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
exports.getPostById = getPostById;
const getPostByIdUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    let token = authHeader && authHeader.split(" ")[1];
    token !== null && token !== void 0 ? token : (token = "");
    if (!token) {
        res.status(400).json({ msg: "No se ha enviado el token" });
        return;
    }
    try {
        if (!fs_1.default.existsSync((0, Utils_1.getPath)(pathFile))) {
            res.status(404).json({ msg: "Post not found" });
            return;
        }
        const decoded = (yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY));
        const idToken = decoded.id;
        const getDataPost = yield (0, Utils_1.getDataConvert)((0, Utils_1.getPath)(pathFile));
        const filterPostByIdUser = getDataPost.filter((item) => item.idUser === idToken);
        res.status(200).json(filterPostByIdUser);
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
exports.getPostByIdUser = getPostByIdUser;
const postPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fs_1.default.existsSync((0, Utils_1.getPath)(pathFile))) {
            fs_1.default.writeFileSync((0, Utils_1.getPath)(pathFile), JSON.stringify([], null, 2));
        }
        const getDataPost = yield (0, Utils_1.getDataConvert)((0, Utils_1.getPath)(pathFile));
        const verifyDataPost = getDataPost.find((item) => item.titulo === req.body.titulo && item.tipo === req.body.tipo);
        if (verifyDataPost !== undefined) {
            res.status(400).json({ msg: "Post already exists" });
            return;
        }
        req.body.id = (0, uuid_1.v4)();
        req.body.fecha = (0, Utils_1.genertaDate)();
        getDataPost.push(req.body);
        fs_1.default.writeFileSync((0, Utils_1.getPath)(pathFile), JSON.stringify(getDataPost, null, 2));
        res.status(201).json(req.body);
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
exports.postPost = postPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const existsPost = yield (0, Utils_1.getVerifyExistsData)(id, (0, Utils_1.getPath)(pathFile));
        const updatedPost = yield (0, Utils_1.getDataConvert)((0, Utils_1.getPath)(pathFile));
        let verifyUpdate = false;
        const dataPostReq = req.body;
        for (const key in dataPostReq) {
            if (dataPostReq[key] !== existsPost[key]) {
                verifyUpdate = true;
                existsPost[key] = dataPostReq[key];
            }
        }
        if (!verifyUpdate) {
            res.status(200).json({ msg: "There were no updated data" });
            return;
        }
        const updatedPostById = updatedPost.map((item) => item.id === id ? existsPost : item);
        fs_1.default.writeFileSync((0, Utils_1.getPath)(pathFile), JSON.stringify(updatedPostById, null, 2));
        res.status(200).json(existsPost);
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
exports.updatePost = updatePost;
const changeStatusPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedPost = yield (0, Utils_1.getDataConvert)((0, Utils_1.getPath)(pathFile));
        const existsPost = updatedPost.find((item) => item.id === id);
        if (existsPost === undefined) {
            res.status(401).json({ msg: "Post not found" });
            return;
        }
        const newPostUpdate = updatedPost.map((item) => item.id === id ? Object.assign(Object.assign({}, item), { status: !item.status }) : item);
        fs_1.default.writeFileSync((0, Utils_1.getPath)(pathFile), JSON.stringify(newPostUpdate, null, 2));
        res.status(200).json({ msg: "Status updated" });
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
exports.changeStatusPost = changeStatusPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield (0, Utils_1.getVerifyExistsData)(id, (0, Utils_1.getPath)(pathFile));
        const getDataPost = yield (0, Utils_1.getDataConvert)((0, Utils_1.getPath)(pathFile));
        const newDataPost = getDataPost.filter((item) => item.id !== id);
        fs_1.default.writeFileSync((0, Utils_1.getPath)(pathFile), JSON.stringify(newDataPost, null, 2));
        res.status(200).json({ msg: "Post deleted" });
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
exports.deletePost = deletePost;
