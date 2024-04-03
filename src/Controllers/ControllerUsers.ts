import fs from "fs";
import { Request, Response } from "express";
import generteJwt from "../Helper/GenerateJwt";
import { getPath, getDataConvert, getVerifyExistsData } from "../Utils/Utils";
import { sendErrors } from "../Err/Errors";
import { Post, TypesJwt, User } from "../Types/types";
import { v4 as uuidv4 } from "uuid";
import Jwt from "jsonwebtoken";
import { comparePassword, encrypPassword } from "../Helper/EncrypPassword";

// const getPath = () => {
//   const rootDir = getRootDir();
//   const pathJson = path.join(rootDir, "db", "users.json");
//   return pathJson;
// };

const pathFile = "users";

const getUsers = async (_req: Request, res: Response) => {
  try {
    const getUsersData = await getDataConvert(getPath(pathFile));
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
  const authHeader = req.headers?.authorization;
  let token = authHeader && authHeader.split(" ")[1];
  token ??= "";
  if (!token) {
    res.status(400).json({ msg: "No se ha enviado el token" });
    return;
  }
  try {
    const decoded: TypesJwt = (await Jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    )) as TypesJwt;
    const idToken = decoded.id;

    const getUserByIdData = await getVerifyExistsData(
      idToken,
      getPath(pathFile)
    );
    const getDataPost: Post[] = await getDataConvert(getPath("data"));
    const filterPostByIdUser = getDataPost.filter(
      (item) => item.idUser === idToken
    );
    res.status(200).json({ getUserByIdData, filterPostByIdUser });
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
    const getUserData: User[] = await getDataConvert(getPath(pathFile));
    const existsUser: User | undefined = getUserData.find(
      (item) => item.email === email
    );
    if (existsUser === undefined) {
      res.status(401).json({ msg: "User not found" });
      return;
    }
    const existsPassword = await comparePassword(password, existsUser.password);
    if (!existsPassword) {
      res.status(401).json({ msg: "Invalid password" });
      return;
    }

    const token = generteJwt(existsUser.id);
    const newUser: User = { ...existsUser, token, active: true };
    const newUserData = getUserData.map((item) =>
      item.id === newUser.id ? newUser : item
    );
    fs.writeFileSync(getPath(pathFile), JSON.stringify(newUserData, null, 2));
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
    const getUserData: User[] = await getDataConvert(getPath(pathFile));
    const existsUser = getUserData.find((item) => item.email === email);
    if (existsUser !== undefined) {
      res.status(401).json({ msg: "User already exists" });
      return;
    }
    const { password: _, ...rest } = req.body;
    const passwordHas = await encrypPassword(password);
    const id = uuidv4();
    const token = "";
    const active = false;
    const newUser: User = {
      id,
      password: passwordHas,
      token,
      active,
      ...rest,
    };
    getUserData.push(newUser);
    fs.writeFileSync(getPath(pathFile), JSON.stringify(getUserData, null, 2));
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
    const getUserData = await getDataConvert(getPath(pathFile));
    const existsUser = getUserData.find((item: User) => item.id === id);
    if (existsUser === undefined) {
      res.status(401).json({ msg: "User not found" });
      return;
    }

    const dataUserReq = req.body;
    let verifyUpdate: boolean = false;
    for (const key in dataUserReq) {
      if (dataUserReq[key] !== existsUser[key]) {
        verifyUpdate = true;
        if (key === "password") {
          if (dataUserReq[key].trim() !== "") {
            const passwordHas = await encrypPassword(dataUserReq[key]);
            existsUser[key] = passwordHas;
          }
        } else if (key === "active") {
          existsUser[key] = JSON.parse(dataUserReq[key]);
        } else {
          existsUser[key] = dataUserReq[key];
        }
      }
    }
    if (!verifyUpdate) {
      res.status(200).json({ msg: "There were no updated data" });
      return;
    }
    const newDataPost: User[] = getUserData.map((item: User) =>
      item.id === id ? existsUser : item
    );

    fs.writeFileSync(getPath(pathFile), JSON.stringify(newDataPost, null, 2));
    res.status(200).json(existsUser);
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const retrievePassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const getUserData: User[] = await getDataConvert(getPath(pathFile));
    const existsUser = getUserData.find((item) => item.email === email);
    if (existsUser === undefined) {
      res.status(401).json({ msg: "User not found" });
      return;
    }
    const token = generteJwt(existsUser.id);
    const newUser = getUserData.map((item) =>
      item.id === existsUser.id ? { ...existsUser, token } : item
    );
    fs.writeFileSync(getPath(pathFile), JSON.stringify(newUser, null, 2));
    res.status(200).json(token);
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const changePassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const authHeader = req.headers?.authorization;
  let token = authHeader && authHeader.split(" ")[1];
  token ??= "";
  if (!token) {
    res.status(400).json({ msg: "No se ha enviado el token" });
    return;
  }
  try {
    const decoded: TypesJwt = (await Jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    )) as TypesJwt;
    const id = decoded.id;

    const getUserData: User[] = await getDataConvert(getPath(pathFile));
    const existsUser = getUserData.find(
      (item) => item.id === id && item.token === token
    );
    if (existsUser === undefined) {
      res.status(401).json({ msg: "User not found" });
      return;
    }
    const newPasssword = await encrypPassword(password);
    const newUser = getUserData.map((item) =>
      item.id === existsUser.id
        ? { ...existsUser, token: "", password: newPasssword }
        : item
    );
    fs.writeFileSync(getPath(pathFile), JSON.stringify(newUser, null, 2));
    res.status(200).json({ msg: "Change password successfully" });
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
  const authHeader = req.headers?.authorization;
  let token = authHeader && authHeader.split(" ")[1];
  token ??= "";
  if (!token) {
    res.status(400).json({ msg: "No se ha enviado el token" });
    return;
  }
  try {
    const decoded: TypesJwt = (await Jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    )) as TypesJwt;
    const idToken = decoded.id;
    if (idToken !== id) {
      res.status(401).json({ msg: "User not found" });
      return;
    }
    const getUserData: User[] = await getDataConvert(getPath(pathFile));
    const existsUser = getUserData.find((item) => item.id === id);
    if (existsUser === undefined) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    const newUser = getUserData.filter((item) => item.id !== id);
    fs.writeFileSync(getPath(pathFile), JSON.stringify(newUser, null, 2));
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
  const email = req.query.email as string;
  const authHeader = req.headers?.authorization;
  let token = authHeader && authHeader.split(" ")[1];
  token ??= "";
  if (!token) {
    res.status(400).json({ msg: "No se ha enviado el token" });
    return;
  }
  try {
    const decoded: TypesJwt = (await Jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    )) as TypesJwt;
    const id = decoded.id;
    const getUserData: User[] = await getDataConvert(getPath(pathFile));
    const existsUser = getUserData.find(
      (item) => item.id === id && item.email === email
    );
    if (existsUser === undefined) {
      res.status(401).json({ msg: "User not found" });
      return;
    }
    const newUser = getUserData.map((item) =>
      item.id === id ? { ...item, token: "", active: false } : item
    );
    fs.writeFileSync(getPath(pathFile), JSON.stringify(newUser, null, 2));
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
  retrievePassword,
  changePassword,
  deleteUser,
  logoutUser,
};
