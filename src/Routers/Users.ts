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

const router = Router();

router.get("/", getUsers);
router.post("/login", loginUserAutheticate);
router.post("/register", registerUser);
router.get("/user/:id", getUserById);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);
router.post("logout/:id", logoutUser);

export default router;
