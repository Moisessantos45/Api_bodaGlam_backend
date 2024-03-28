"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrors = void 0;
const sendErrors = (res, err, status) => {
    res.status(status).json({ msg: err });
    return;
};
exports.sendErrors = sendErrors;
