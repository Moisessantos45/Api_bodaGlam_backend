import { Router } from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  loginUserAutheticate,
  logoutUser,
  registerUser,
  updateUser,
} from "../Controllers/ControllerUsers";
import authSesion from "../Middleware/authSesion";

const router = Router();

router.get("/", getUsers);
router.post("/login", loginUserAutheticate);
router.post("/register", registerUser);
router.get("/user", authSesion, getUserById);
router.put("/updateUser/:id", authSesion, updateUser);
router.delete("/deleteUser/:id", authSesion, deleteUser);
router.post("/logout/:id", authSesion, logoutUser);

export default router;
