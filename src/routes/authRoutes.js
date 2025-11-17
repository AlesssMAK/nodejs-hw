import { Router } from 'express';
import { registerUser } from '../controllers/authController.js';
import { celebrate } from 'celebrate';
import { registerUserSchema } from '../validations/authValidation.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
