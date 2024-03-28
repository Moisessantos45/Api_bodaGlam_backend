import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import generteJwt from "../Helper/GenerateJwt";
import {
  getDataConvert,
  getRootDir,
  getVerifyExistsData,
} from "../Utils/Utils";
import { sendErrors } from "../Err/Errors";
import { User } from "../Types/types";
import { v4 as uuidv4 } from "uuid";

const getPath = () => {
  const rootDir = getRootDir();
  const pathJson = path.join(rootDir, "db", "users.json");
  return pathJson;
};

const getUsers = async (_req: Request, res: Response) => {
  try {
    const getUsersData = await getDataConvert(getPath());
    res.status(202).json(getUsersData);
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const getUserByIdData = await getVerifyExistsData(id, getPath());
    res.status(200).json(getUserByIdData);
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const loginUserAutheticate = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const getUserData: User[] = await getDataConvert(getPath());
    const existsUser: User | undefined = getUserData.find(
      (item) => item.email === email && item.password === password
    );
    if (existsUser === undefined) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    const token = generteJwt(existsUser.id);
    const newUser: User = { ...existsUser, token };
    const newUserData = getUserData.map((item) =>
      item.id === newUser.id ? newUser : item
    );
    fs.writeFileSync(getPath(), JSON.stringify(newUserData, null, 2));
    const { password: omitPassword, ...rest } = newUser;
    res.status(200).json(rest);
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const getUserData: User[] = await getDataConvert(getPath());
    const existsUser = getUserData.find((item) => item.email === email);
    if (existsUser !== undefined) {
      res.status(401).json({ message: "User already exists" });
      return;
    }
    const { password: pass, ...rest } = req.body;
    const id = uuidv4();
    const token = "";
    const clave = "";
    const newUser: User = {
      id,
      password,
      token,
      clave,
      ...rest,
    };
    getUserData.push(newUser);
    fs.writeFileSync(getPath(), JSON.stringify(getUserData, null, 2));
    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const getUserData: User[] = await getDataConvert(getPath());
    const existsUser = getUserData.find((item) => item.id === id);
    if (existsUser === undefined) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    const newUser = getUserData.map((item) =>
      item.id === id ? { ...item, ...req.body } : item
    );

    fs.writeFileSync(getPath(), JSON.stringify(newUser, null, 2));
    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const getUserData: User[] = await getDataConvert(getPath());
    const existsUser = getUserData.find((item) => item.id === id);
    if (existsUser === undefined) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    const newUser = getUserData.filter((item) => item.id !== id);
    fs.writeFileSync(getPath(), JSON.stringify(newUser, null, 2));
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const logoutUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const getUserData: User[] = await getDataConvert(getPath());
    const existsUser = getUserData.find(
      (item) => item.id === id && item.email === email
    );
    if (existsUser === undefined) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    const newUser = getUserData.map((item) =>
      item.id === id ? { ...item, token: "" } : item
    );
    fs.writeFileSync(getPath(), JSON.stringify(newUser, null, 2));
    res.status(200).json({ msg: "User logout successfully" });
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

export {
  getUsers,
  getUserById,
  loginUserAutheticate,
  registerUser,
  updateUser,
  deleteUser,
  logoutUser,
};
