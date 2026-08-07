import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createRatingSchema, respondToRatingSchema } from './rating.validation.js';
import * as ratingController from './rating.controller.js';

const router = Router();

// Public - anyone should be able to see a seller's reviews before messaging them.
router.get('/user/:userId', ratingController.getForUser);

router.post('/', authenticate, validate(createRatingSchema), ratingController.create);
router.post(
  '/:id/response',
  authenticate,
  validate(respondToRatingSchema),
  ratingController.respond
);

export default router;