import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import listingRoutes from './modules/listings/listing.routes.js';
import requestRoutes from './modules/requests/request.routes.js';
import wishlistRoutes from './modules/wishlist/wishlist.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import ratingRoutes from './modules/ratings/rating.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import reportRoutes from './modules/reports/report.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import userRoutes from './modules/users/user.routes.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // required so the browser sends/receives the httpOnly cookie
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/conversations', chatRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Additional modules (requests, wishlist, chat, ratings,
// notifications, reports, admin) mount here in the same pattern as we
// build them out in the phases that follow.

// Must be the LAST middleware - catches everything thrown anywhere above.
app.use(errorHandler);