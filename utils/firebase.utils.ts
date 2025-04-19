 
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Create a storage reference with metadata
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    
    // Add metadata to the file
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: 'user', // You can modify this based on your needs
        originalName: file.name
      }
    };

    // Upload the file with metadata
    const snapshot = await uploadBytes(storageRef, file, metadata);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File uploaded successfully:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const uploadMultipleFiles = async (files: File[], path: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadFile(file, path));
    const downloadURLs = await Promise.all(uploadPromises);
    console.log('All files uploaded successfully');
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw new Error(`Failed to upload multiple files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to delete a file
export const deleteFile = async (url: string): Promise<void> => {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 