import { Request, Response } from 'express';
import { generateToken } from '../utils/jwtUtils';

export const registerController = async (req: Request, res: Response) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const token = generateToken(user);
    console.log(token);
    res.send(token);
  } catch (error) {
    throw new Error(`There is an error in registerContoller error: ${error}`);
  }
};
