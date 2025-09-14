import { Router } from 'express';
import { signUp } from '#controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', (req, res) => {
  res.send('POST /api/auth/sign-in response');
});

authRouter.post('/sign-out', (req, res) => {
  res.send('POST /api/auth/sign-out response');
});

export default authRouter;
