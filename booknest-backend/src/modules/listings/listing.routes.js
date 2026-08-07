import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import {
  createListingSchema,
  updateListingSchema,
  updateStatusSchema,
  searchListingsSchema,
} from './listing.validation.js';
import * as listingController from './listing.controller.js';

const router = Router();

// Public - anyone can browse without an account (important for conversion:
// a visitor shouldn't need to sign up just to see what's available).
router.get('/', validate(searchListingsSchema), listingController.search);
router.get('/:id', listingController.getById);

// Authenticated - creating/modifying requires an account.
router.post(
  '/',
  authenticate,
  upload.array('images', 5),
  validate(createListingSchema),
  listingController.create
);
router.patch('/:id', authenticate, validate(updateListingSchema), listingController.update);
router.patch(
  '/:id/status',
  authenticate,
  validate(updateStatusSchema),
  listingController.updateStatus
);
router.post('/:id/images', authenticate, upload.array('images', 5), listingController.addImages);
router.delete('/:id', authenticate, listingController.remove);

export default router;