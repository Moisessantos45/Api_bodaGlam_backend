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
exports.deletePost = exports.updatePost = exports.postPost = exports.getPostById = exports.getPost = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Utils_1 = require("../Utils/Utils");
const uuid_1 = require("uuid");
const Errors_1 = require("../Err/Errors");
const getPath = () => {
    const rootDir = (0, Utils_1.getRootDir)();
    const pathJson = path_1.default.join(rootDir, "db", "data.json");
    return pathJson;
};
const getPost = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fs_1.default.existsSync(getPath())) {
            res.status(404).json({ msg: "Post not found" });
            return;
        }
        const getPostData = yield (0, Utils_1.getDataConvert)(getPath());
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
        const filterPostById = yield (0, Utils_1.getVerifyExistsData)(id, getPath());
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
const postPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fs_1.default.existsSync(getPath())) {
            fs_1.default.writeFileSync(getPath(), JSON.stringify([], null, 2));
        }
        const getDataPost = yield (0, Utils_1.getDataConvert)(getPath());
        req.body.id = (0, uuid_1.v4)();
        getDataPost.push(req.body);
        fs_1.default.writeFileSync(getPath(), JSON.stringify(getDataPost, null, 2));
        res.status(201).json({ msg: "Post created" });
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
        const getDataPost = yield (0, Utils_1.getDataConvert)(getPath());
        yield (0, Utils_1.getVerifyExistsData)(id, getPath());
        const updatedPostById = getDataPost.map((item) => item.id === id ? Object.assign(Object.assign({}, item), req.body) : item);
        fs_1.default.writeFileSync(getPath(), JSON.stringify(updatedPostById, null, 2));
        res.status(200).json({ msg: "Post updated" });
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
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getDataPost = yield (0, Utils_1.getDataConvert)(getPath());
        yield (0, Utils_1.getVerifyExistsData)(id, getPath());
        const newDataPost = getDataPost.filter((item) => item.id !== id);
        fs_1.default.writeFileSync(getPath(), JSON.stringify(newDataPost, null, 2));
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
