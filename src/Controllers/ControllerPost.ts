import fs from "fs";
import { Request, Response } from "express";
import {
  genertaDate,
  getPath,
  getDataConvert,
  getVerifyExistsData,
} from "../Utils/Utils";
import { Post, TypesJwt } from "../Types/types";
import { v4 as uuidv4 } from "uuid";
import Jwt from "jsonwebtoken";
import { sendErrors } from "../Err/Errors";

// const getPath = () => {
//   const rootDir = getRootDir();
//   const pathJson = path.join(rootDir, "db", "data.json");
//   return pathJson;
// };

const pathFile = "data";

const getPost = async (_req: Request, res: Response) => {
  try {
    if (!fs.existsSync(getPath(pathFile))) {
      res.status(404).json({ msg: "Post not found" });
      return;
    }
    const getPostData: Post[] = await getDataConvert(getPath(pathFile));
    res.status(202).json(getPostData);
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const filterPostById: Post = await getVerifyExistsData(
      id,
      getPath(pathFile)
    );
    res.status(200).json(filterPostById);
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const getPostByIdUser = async (req: Request, res: Response) => {
  const authHeader = req.headers?.authorization;
  let token = authHeader && authHeader.split(" ")[1];
  token ??= "";
  if (!token) {
    res.status(400).json({ msg: "No se ha enviado el token" });
    return;
  }
  try {
    if (!fs.existsSync(getPath(pathFile))) {
      res.status(404).json({ msg: "Post not found" });
      return;
    }
    const decoded: TypesJwt = (await Jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    )) as TypesJwt;
    const idToken = decoded.id;
    const getDataPost: Post[] = await getDataConvert(getPath(pathFile));
    const filterPostByIdUser = getDataPost.filter(
      (item) => item.idUser === idToken
    );
    res.status(200).json(filterPostByIdUser);
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const postPost = async (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(getPath(pathFile))) {
      fs.writeFileSync(getPath(pathFile), JSON.stringify([], null, 2));
    }
    const getDataPost: Post[] = await getDataConvert(getPath(pathFile));
    const verifyDataPost = getDataPost.find(
      (item) => item.titulo === req.body.titulo && item.tipo === req.body.tipo
    );
    if (verifyDataPost !== undefined) {
      res.status(400).json({ msg: "Post already exists" });
      return;
    }
    req.body.id = uuidv4();
    req.body.fecha = genertaDate();
    getDataPost.push(req.body);
    fs.writeFileSync(getPath(pathFile), JSON.stringify(getDataPost, null, 2));
    res.status(201).json(req.body);
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const existsPost = await getVerifyExistsData(id, getPath(pathFile));
    const updatedPost: Post[] = await getDataConvert(getPath(pathFile));
    let verifyUpdate: boolean = false;
    const dataPostReq = req.body;

    for (const key in dataPostReq) {
      if (dataPostReq[key] !== existsPost[key]) {
        verifyUpdate = true;
        existsPost[key] = dataPostReq[key];
      }
    }
    if (!verifyUpdate) {
      res.status(200).json({ msg: "There were no updated data" });
      return;
    }
    const updatedPostById = updatedPost.map((item) =>
      item.id === id ? existsPost : item
    );
    fs.writeFileSync(
      getPath(pathFile),
      JSON.stringify(updatedPostById, null, 2)
    );
    res.status(200).json(existsPost);
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const changeStatusPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedPost: Post[] = await getDataConvert(getPath(pathFile));
    const existsPost = updatedPost.find((item) => item.id === id);
    if (existsPost === undefined) {
      res.status(401).json({ msg: "Post not found" });
      return;
    }
    const newPostUpdate = updatedPost.map((item) =>
      item.id === id ? { ...item, status: !item.status } : item
    );
    fs.writeFileSync(getPath(pathFile), JSON.stringify(newPostUpdate, null, 2));
    res.status(200).json({ msg: "Status updated" });
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await getVerifyExistsData(id, getPath(pathFile));
    const getDataPost: Post[] = await getDataConvert(getPath(pathFile));
    const newDataPost: Post[] = getDataPost.filter((item) => item.id !== id);
    fs.writeFileSync(getPath(pathFile), JSON.stringify(newDataPost, null, 2));
    res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

export {
  getPost,
  getPostById,
  getPostByIdUser,
  postPost,
  updatePost,
  changeStatusPost,
  deletePost,
};
