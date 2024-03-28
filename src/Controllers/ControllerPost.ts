import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import {
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
    const filterPostById: Post[] = await getVerifyExistsData(id, getPath());
    res.status(200).json(filterPostById);
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
    const getDataPost: Post[] = await getDataConvert(getPath());
    await getVerifyExistsData(id, getPath());
    const updatedPostById = getDataPost.map((item) =>
      item.id === id ? { ...item, ...req.body } : item
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
    const getDataPost: Post[] = await getDataConvert(getPath());
    await getVerifyExistsData(id, getPath());
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

export { getPost, getPostById, postPost, updatePost, deletePost };
