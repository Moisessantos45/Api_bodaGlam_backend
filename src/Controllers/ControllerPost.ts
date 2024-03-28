import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { getDataConvert, getRootDir } from "../Utils/Utils";
import { Post } from "../Types/types";
import { v4 as uuidv4 } from "uuid";
import { sendErrors } from "../Err/Errors";

const getPath = () => {
  const rootDir = getRootDir();
  const pathJson = path.join(rootDir, "db", "data.json");
  return pathJson;
};

const getVerifyExistsPost = async (id: string) => {
  const getDataPost: Post[] = await getDataConvert(getPath());
  const verifyFilterPostById: Post[] = getDataPost.filter(
    (item) => item.id === id
  );
  if (verifyFilterPostById.length === 0) {
    throw "Post not found";
  }
  return verifyFilterPostById;
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
    res.status(501).json({ msg: "ocurrio un error" });
  }
};

const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const filterPostById: Post[] = await getVerifyExistsPost(id);
    res.status(200).json(filterPostById);
  } catch (error) {
    res.status(501).json({ msg: "ocurrio un error" });
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
    res.status(501).json({ msg: "ocurrio un error" });
  }
};

const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const getDataPost: Post[] = await getDataConvert(getPath());
    await getVerifyExistsPost(id);
    const updatedPostById = getDataPost.map((item) =>
      item.id === id ? { ...item, ...req.body } : item
    );
    fs.writeFileSync(getPath(), JSON.stringify(updatedPostById, null, 2));
    res.status(200).json({ msg: "Post updated" });
  } catch (error) {
    res.status(501).json({ msg: "ocurrio un error" });
  }
};

const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const getDataPost: Post[] = await getDataConvert(getPath());
    await getVerifyExistsPost(id);
    const newDataPost: Post[] = getDataPost.filter((item) => item.id !== id);
    fs.writeFileSync(getPath(), JSON.stringify(newDataPost, null, 2));
    res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    sendErrors(res, error.message, 501);
  }
};

export { getPost, getPostById, postPost, updatePost, deletePost };
