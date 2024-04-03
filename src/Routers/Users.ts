import { Router } from "express";
import {
  changePassword,
  deleteUser,
  getUserById,
  getUsers,
  loginUserAutheticate,
  logoutUser,
  registerUser,
  retrievePassword,
  updateUser,
} from "../Controllers/ControllerUsers";
import authSesion from "../Middleware/authSesion";

const router = Router();

router.get("/", getUsers);
router.post("/login", loginUserAutheticate);
router.post("/register", registerUser);
router.get("/user", authSesion, getUserById);
router.put("/updateUser/:id", authSesion, updateUser);
router.post("/retrieve-password", retrievePassword);
router.post("/change-password", changePassword);
router.delete("/deleteUser/:id", authSesion, deleteUser);
router.post("/logout", authSesion, logoutUser);

export default router;
