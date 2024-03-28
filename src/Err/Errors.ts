import { Response } from "express";

const sendErrors = (res: Response, err: string, status: number) => {
  res.status(status).json({ msg: err });
  return
};

export { sendErrors };
