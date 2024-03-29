"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ControllerPost_1 = require("../Controllers/ControllerPost");
const authSesion_1 = __importDefault(require("../Middleware/authSesion"));
const router = (0, express_1.Router)();
router.get("/", ControllerPost_1.getPost);
router.get("/:id", ControllerPost_1.getPostById);
router.get("/:idUser", authSesion_1.default, ControllerPost_1.getPostByIdUser);
router.post("/", authSesion_1.default, ControllerPost_1.postPost);
router.put("/:id", authSesion_1.default, ControllerPost_1.updatePost);
router.delete("/:id", authSesion_1.default, ControllerPost_1.deletePost);
exports.default = router;
