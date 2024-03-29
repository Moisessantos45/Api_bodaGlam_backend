import Jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

const authSesion = (req: Request, res: Response, next: NextFunction) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      Jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      return next();
    } catch (error) {
      res.status(401).json({ msg: "Token is not" });
      return;
    }
  }
  if (!token) {
    res.status(401).json({ msg: "Token is not" });
    return;
  }
};

export default authSesion;
