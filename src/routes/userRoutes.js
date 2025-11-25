import { Router } from 'express';
import { celebrate } from 'celebrate';
import { requestResetEmailSchema } from '../validations/authValidation.js';
import { requestResetEmail } from '../controllers/userController.js';

const router = Router();

router.podt(
  '/auth/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail,
);

export default router;
