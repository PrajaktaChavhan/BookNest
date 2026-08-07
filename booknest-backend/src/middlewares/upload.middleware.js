import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Memory storage (not disk) - we immediately stream the buffer to Cloudinary
// and never need the file to persist on our own server's filesystem.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(ApiError.badRequest('Only JPEG, PNG, or WEBP images are allowed'));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB per image, max 5 images per listing
});