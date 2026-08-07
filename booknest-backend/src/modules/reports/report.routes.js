import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createReportSchema } from './report.validation.js';
import * as reportController from './report.controller.js';

const router = Router();

router.post('/', authenticate, validate(createReportSchema), reportController.create);

export default router;