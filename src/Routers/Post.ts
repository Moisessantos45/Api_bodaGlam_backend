import { Router } from "express";
import {
  changeStatusPost,
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
router.get("/post_user", authSesion, getPostByIdUser);
router.post("/", authSesion, postPost);
router.put("/:id", authSesion, updatePost);
router.patch("/:id", authSesion, changeStatusPost);
router.delete("/:id", authSesion, deletePost);

export default router;
