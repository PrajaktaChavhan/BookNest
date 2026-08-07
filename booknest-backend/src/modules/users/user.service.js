import { User } from './user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { uploadImages } from '../../utils/cloudinaryHelpers.js';

const PUBLIC_FIELDS = 'name profilePicture college department semester locality bio averageRating ratingCount createdAt';

export async function getPublicProfile(userId) {
  const user = await User.findById(userId).select(PUBLIC_FIELDS);
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

export async function updateProfile(userId, updates) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  Object.assign(user, updates);
  await user.save();
  return user;
}

export async function updateAvatar(userId, file) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const [uploaded] = await uploadImages([file], 'booknest/avatars');
  user.profilePicture = uploaded.url;
  await user.save();
  return user;
}