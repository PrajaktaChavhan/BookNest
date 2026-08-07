import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import * as notificationController from './notification.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.list);
router.patch('/:id/read', notificationController.markRead);
router.patch('/read-all', notificationController.markAllRead);

export default router;