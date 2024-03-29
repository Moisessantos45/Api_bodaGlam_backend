import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import {
  genertaDate,
  getDataConvert,
  getRootDir,
  getVerifyExistsData,
} from "../Utils/Utils";
import { Post } from "../Types/types";
import { v4 as uuidv4 } from "uuid";
import { sendErrors } from "../Err/Errors";

const getPath = () => {
  const rootDir = getRootDir();
  const pathJson = path.join(rootDir, "db", "data.json");
  return pathJson;
};

const getPost = async (_req: Request, res: Response) => {
  try {
    if (!fs.existsSync(getPath())) {
      res.status(404).json({ msg: "Post not found" });
      return;
    }
    const getPostData: Post[] = await getDataConvert(getPath());
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
    const filterPostById: Post = await getVerifyExistsData(id, getPath());
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
  const { idUser } = req.params;
  try {
    if (!fs.existsSync(getPath())) {
      res.status(404).json({ msg: "Post not found" });
      return;
    }
    const getDataPost: Post[] = await getDataConvert(getPath());
    const filterPostByIdUser = getDataPost.filter(
      (item) => item.idUser === idUser
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
    if (!fs.existsSync(getPath())) {
      fs.writeFileSync(getPath(), JSON.stringify([], null, 2));
    }
    const getDataPost: Post[] = await getDataConvert(getPath());
    req.body.id = uuidv4();
    req.body.fecha = genertaDate();
    getDataPost.push(req.body);
    fs.writeFileSync(getPath(), JSON.stringify(getDataPost, null, 2));
    res.status(201).json({ msg: "Post created" });
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
    const existsPost = await getVerifyExistsData(id, getPath());
    const updatedPost: Post[] = await getDataConvert(getPath());
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
    fs.writeFileSync(getPath(), JSON.stringify(updatedPostById, null, 2));
    res.status(200).json({ msg: "Post updated" });
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
    await getVerifyExistsData(id, getPath());
    const getDataPost: Post[] = await getDataConvert(getPath());
    const newDataPost: Post[] = getDataPost.filter((item) => item.id !== id);
    fs.writeFileSync(getPath(), JSON.stringify(newDataPost, null, 2));
    res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    if (error instanceof Error) {
      sendErrors(res, error.message, 501);
    } else {
      sendErrors(res, "An unexpected error occurred", 501);
    }
  }
};

export { getPost, getPostById,getPostByIdUser, postPost, updatePost, deletePost };
