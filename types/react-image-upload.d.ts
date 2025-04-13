declare module 'react-image-upload' {
  import { ComponentType } from 'react';

  interface ImageUploadProps {
    onFileAdded: (file: File | File[]) => void;
    multiple?: boolean;
    style?: React.CSSProperties;
  }
 
  const ImageUpload: ComponentType<ImageUploadProps>;
  export default ImageUpload;
} 
