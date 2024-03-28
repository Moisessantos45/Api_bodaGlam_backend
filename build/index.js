"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Routers_1 = __importDefault(require("./Routers"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
app.use("/img", express_1.default.static("./public/img"));
app.use("/api/1.0", Routers_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`servidor funcionando ${PORT}`);
});
