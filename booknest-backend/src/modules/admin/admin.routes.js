import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';
import * as adminController from './admin.controller.js';

const router = Router();

// Every route below requires both a valid login AND the admin role - the
// two middlewares are deliberately separate (authentication vs.
// authorization) rather than combined into one, per our Phase 6 principle
// of keeping each piece of logic single-purpose and reusable.
router.use(authenticate, isAdmin);

const suspendSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ isSuspended: z.boolean() }),
});

router.get('/users', adminController.getUsers);
router.patch('/users/:id/suspend', validate(suspendSchema), adminController.updateUserSuspension);

router.get('/listings', adminController.getListings);
router.delete('/listings/:id', adminController.deleteListing);

router.get('/reports', adminController.getReports);
router.patch('/reports/:id/resolve', adminController.resolveReport);

router.get('/analytics', adminController.getAnalytics);

export default router;