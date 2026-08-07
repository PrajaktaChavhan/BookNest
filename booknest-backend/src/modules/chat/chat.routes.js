import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { startConversationSchema, getMessagesSchema } from './chat.validation.js';
import * as chatController from './chat.controller.js';

const router = Router();

router.use(authenticate); // chat is entirely private - no public routes

router.get('/', chatController.listConversations);
router.post('/', validate(startConversationSchema), chatController.start);
router.get('/:id/messages', validate(getMessagesSchema), chatController.getMessages);

export default router;