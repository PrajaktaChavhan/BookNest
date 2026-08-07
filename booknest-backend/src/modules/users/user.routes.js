import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { updateProfileSchema } from './user.validation.js';
import * as userController from './user.controller.js';

const router = Router();

router.patch('/me', authenticate, validate(updateProfileSchema), userController.updateMe);
router.post('/me/avatar', authenticate, upload.single('avatar'), userController.uploadMyAvatar);
router.get('/:id', userController.getById);

export default router;