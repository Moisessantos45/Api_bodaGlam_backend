"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ControllerPost_1 = require("../Controllers/ControllerPost");
const router = (0, express_1.Router)();
router.get("/", ControllerPost_1.getPost);
router.get("/:id", ControllerPost_1.getPostById);
router.post("/", ControllerPost_1.postPost);
router.put("/:id", ControllerPost_1.updatePost);
router.delete("/:id", ControllerPost_1.deletePost);
exports.default = router;