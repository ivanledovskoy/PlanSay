import React, { useRef, useState } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import axios from 'axios';
import { instance } from '../../utils/axios';

interface FileUploadButtonProps extends Omit<ButtonProps, 'onChange'> {
  taskId: number | string;
  accept?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  taskId,
  accept = '*/*',
  children = 'Upload File',
  onSuccess,
  onError,
  ...buttonProps
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('uploaded_file', file);

  const uploadFile = async (taskId: any) => {
    try {
      if (taskId) {
        await instance.post( `/tasks/${taskId}`, formData, {headers: {            
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})
      }
    } catch (error) {
      sessionStorage.clear()
      console.log(error)
    }
    //dispatch(getInbox(sessionStorage.getItem('token')))
  }

    try {
      setIsLoading(true);
    const response = await instance.post( `/files?task_id=${taskId}`, formData, {headers: {            
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`}})

      onSuccess?.(response.data);
    } catch (error) {
      onError?.(error);
      console.error('File upload error:', error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <Button
        {...buttonProps}
        variant="contained"
        component="span"
        disabled={isLoading}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? 'Uploading...' : children}
      </Button>
    </div>
  );
};

export default FileUploadButton;