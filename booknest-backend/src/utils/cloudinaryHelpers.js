import cloudinary from '../config/cloudinary.js';

// Multer gives us buffers in memory - this streams each one to Cloudinary
// without ever writing to our own server's disk.
export function uploadImageBuffer(buffer, folder = 'booknest/listings') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream.end(buffer);
  });
}

export async function uploadImages(files = [], folder) {
  return Promise.all(files.map((file) => uploadImageBuffer(file.buffer, folder)));
}

export async function deleteImages(images = []) {
  await Promise.all(
    images.map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => null))
  );
}