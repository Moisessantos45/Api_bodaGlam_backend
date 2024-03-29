import { Router } from "express";
import {
  deletePost,
  getPost,
  getPostById,
  getPostByIdUser,
  postPost,
  updatePost,
} from "../Controllers/ControllerPost";
import authSesion from "../Middleware/authSesion";

const router = Router();

router.get("/", getPost);
router.get("/:id", getPostById);
router.get("/postUser/:idUser", authSesion, getPostByIdUser);
router.post("/", authSesion, postPost);
router.put("/:id", authSesion, updatePost);
router.delete("/:id", authSesion, deletePost);

export default router;
