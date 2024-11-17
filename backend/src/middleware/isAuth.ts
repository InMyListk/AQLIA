import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    user: any;
  }
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header("authorization");
  const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, JWT_SECRET, (err: any, decode: any) => {
      if (err) {
        res.send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};
