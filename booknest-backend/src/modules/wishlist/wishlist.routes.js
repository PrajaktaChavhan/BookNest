import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import * as wishlistController from './wishlist.controller.js';

const router = Router();

router.use(authenticate); // every route here requires a logged-in user

router.get('/', wishlistController.getMyWishlist);
router.post('/:listingId', wishlistController.add);
router.delete('/:listingId', wishlistController.remove);

export default router;