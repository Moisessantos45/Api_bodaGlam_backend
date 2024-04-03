"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ControllerUsers_1 = require("../Controllers/ControllerUsers");
const authSesion_1 = __importDefault(require("../Middleware/authSesion"));
const router = (0, express_1.Router)();
router.get("/", ControllerUsers_1.getUsers);
router.post("/login", ControllerUsers_1.loginUserAutheticate);
router.post("/register", ControllerUsers_1.registerUser);
router.get("/user", authSesion_1.default, ControllerUsers_1.getUserById);
router.put("/updateUser/:id", authSesion_1.default, ControllerUsers_1.updateUser);
router.post("/retrieve-password", ControllerUsers_1.retrievePassword);
router.post("/change-password", ControllerUsers_1.changePassword);
router.delete("/deleteUser/:id", authSesion_1.default, ControllerUsers_1.deleteUser);
router.post("/logout", authSesion_1.default, ControllerUsers_1.logoutUser);
exports.default = router;
