import { Response } from "express";

const sendErrors = (res: Response, err: Error, status: number) => {
  res.status(status).json({ msg: err });
};

export { sendErrors };
