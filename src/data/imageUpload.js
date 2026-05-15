/**
 * Image Upload Utility
 *
 * Uses ImgBB free image hosting API for blog images.
 * No billing required — free tier allows 32MB daily uploads.
 *
 * To get your API key:
 * 1. Go to https://api.imgbb.com/
 * 2. Sign up (free) and get your API key
 * 3. Add it to your .env as VITE_IMGBB_API_KEY
 */

const IMGBB_API = 'https://api.imgbb.com/1/upload';

/**
 * Upload an image file and return the public URL.
 * @param {File} file - The image file to upload
 * @param {string} folder - Subfolder label (for naming only)
 * @returns {Promise<string>} The URL of the uploaded image
 */
export async function uploadImage(file, folder = 'inline') {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_IMGBB_API_KEY not set in .env file. Get a free key at https://api.imgbb.com/');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('name', `${folder}_${Date.now()}_${file.name}`);

  const res = await fetch(`${IMGBB_API}?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Image upload failed — please try again.');
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Upload failed');
  }

  return data.data.url;
}
