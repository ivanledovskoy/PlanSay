// components/FileDownloadPage.tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from "../../utils/axios";

const FileDownloadPage = () => {
  const { fileHash: fileHash } = useParams<{ fileHash: string }>();
  const navigate = useNavigate();

  console.log("hehe", fileHash)

  useEffect(() => {
    const downloadAndClose = async () => {
      try {
        if (!fileHash) return;

        const response = await instance.get(`/files/${fileHash}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          responseType: 'blob'
        });

        // Получаем имя файла из заголовков
        const contentDisposition = response.headers['content-disposition'];
        const filename = contentDisposition 
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : 'file';

        // Создаем и скачиваем файл
        const blob = new Blob([response.data], { type: response.data.type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        setTimeout(() => {
          window.close();
          navigate(-1);
        }, 50);

      } catch (error) {
        console.error('Download failed:', error);
        window.close();
      }
    };

    downloadAndClose();
  }, [fileHash, navigate]);

  return <div></div>;
};

export default FileDownloadPage;