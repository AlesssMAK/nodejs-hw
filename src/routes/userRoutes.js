import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';
import {
  requestResetEmail,
  resetPassword,
} from '../controllers/userController.js';

const router = Router();

router.post(
  '/auth/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail,
);

router.post(
  '/auth/reset-password',
  celebrate(resetPasswordSchema),
  resetPassword,
);

export default router;
