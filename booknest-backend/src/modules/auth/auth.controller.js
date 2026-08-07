import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { env } from '../../config/env.js';
import { sendEmail } from '../../utils/sendEmail.js';
import * as authService from './auth.service.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    locality: user.locality,
    college: user.college,
    department: user.department,
    semester: user.semester,
    whatsappNumber: user.whatsappNumber,
    bio: user.bio,
    profilePicture: user.profilePicture,
    averageRating: user.averageRating,
    ratingCount: user.ratingCount,
    createdAt: user.createdAt,
  };
}

function sendAuthResponse(res, statusCode, user, token, message) {
  res.cookie(env.COOKIE_NAME, token, COOKIE_OPTIONS);
  return ApiResponse(res, statusCode, { user: toSafeUser(user) }, message);
}

export const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  sendAuthResponse(res, 201, user, token, 'Account created');
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  sendAuthResponse(res, 200, user, token, 'Logged in');
});

export const logout = catchAsync(async (req, res) => {
  res.clearCookie(env.COOKIE_NAME, COOKIE_OPTIONS);
  return ApiResponse(res, 200, null, 'Logged out');
});

export const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body.email);

  if (result) {
    const resetUrl = `${env.CLIENT_URL}/reset-password/${result.rawToken}`;
    await sendEmail({
      to: result.user.email,
      subject: 'Reset your BookNest password',
      html: `<p>Click the link below to reset your password. This link expires in 15 minutes.</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });
  }

  // Same response whether or not the email exists - see auth.service.js note.
  return ApiResponse(res, 200, null, 'If that email exists, a reset link has been sent');
});

export const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  return ApiResponse(res, 200, null, 'Password reset successfully');
});

export const getMe = catchAsync(async (req, res) => {
  return ApiResponse(res, 200, { user: toSafeUser(req.user) }, 'Current user');
});
