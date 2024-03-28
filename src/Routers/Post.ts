import { Router } from "express";
import { deletePost, getPost, getPostById, postPost, updatePost } from "../Controllers/ControllerPost";

const router = Router();

router.get("/", getPost);
router.get("/:id",getPostById)
router.post("/",postPost);
router.put("/:id",updatePost);
router.delete("/:id",deletePost);

export default router;
