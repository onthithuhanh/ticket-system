import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';
 

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp','image/jpg','image/gif','image/avif',];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const validateFile = (file: File) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG and WebP images are allowed');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB');
  }
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    validateFile(file);

    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const fullPath = `${path}/${filename}`;

    // Upload file
    const storageRef = ref(storage, fullPath);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });

    // Get download URL
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files: File[], path: string): Promise<string[]> => {
  try {
    // Validate all files first
    files.forEach(validateFile);

    // Upload all files
    const uploadPromises = files.map((file, index) => {
      const timestamp = Date.now();
      const filename = `${timestamp}_${index}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      return uploadImage(file, path);
    });

    const urls = await Promise.all(uploadPromises);
    console.log(123123,urls);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}; 