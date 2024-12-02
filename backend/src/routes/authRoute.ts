import { Router } from 'express';
import { registerController } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/api/v0/register', registerController);

export default authRouter;
