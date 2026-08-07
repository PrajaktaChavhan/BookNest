import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createRequestSchema, browseRequestsSchema } from './request.validation.js';
import * as requestController from './request.controller.js';

const router = Router();

// Public - the Requests board is browsable without an account, same as Listings.
router.get('/', validate(browseRequestsSchema), requestController.browse);

router.post('/', authenticate, validate(createRequestSchema), requestController.create);
router.patch('/:id/fulfill', authenticate, requestController.fulfill);
router.delete('/:id', authenticate, requestController.remove);

export default router;