"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authSesion = (req, res, next) => {
    let token = "";
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            return next();
        }
        catch (error) {
            res.status(401).json({ msg: "Token is not" });
            return;
        }
    }
    if (!token) {
        res.status(401).json({ msg: "Token is not" });
        return;
    }
};
exports.default = authSesion;
