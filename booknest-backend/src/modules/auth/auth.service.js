import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../users/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { env } from '../../config/env.js';

const SALT_ROUNDS = 12;
const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes - per Phase 4 acceptance criteria

function signToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export async function registerUser(input) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists', 'EMAIL_TAKEN');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
    locality: input.locality,
    whatsappNumber: input.whatsappNumber,
    college: input.college,
    department: input.department,
    semester: input.semester,
  });

  const token = signToken(user._id);
  return { user, token };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    // Same error for "no user" and "wrong password" - never reveal which one
    // failed, to avoid leaking whether an email is registered.
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (user.isSuspended) {
    throw ApiError.forbidden('This account has been suspended');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken(user._id);
  return { user, token };
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  // Deliberately don't throw if the user doesn't exist - responding the same
  // way either way prevents email enumeration attacks.
  if (!user) return null;

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
  await user.save();

  return { user, rawToken };
}

export async function resetPassword(rawToken, newPassword) {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordHash +passwordResetToken +passwordResetExpires');

  if (!user) {
    throw ApiError.badRequest('Reset link is invalid or has expired', 'INVALID_RESET_TOKEN');
  }

  user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
}
