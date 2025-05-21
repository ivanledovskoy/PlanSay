// components/FileDownloadPage.tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance } from "../../utils/axios";

const FileDownloadPage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const downloadAndClose = async () => {
      try {
        if (!fileId) return;

        const response = await instance.get(`/files/${fileId}`, {
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

        // Закрываем окно через 500 мс
        setTimeout(() => {
          window.close();
          navigate(-1); // На случай если window.close не сработает
        }, 500);

      } catch (error) {
        console.error('Download failed:', error);
        window.close();
      }
    };

    downloadAndClose();
  }, [fileId, navigate]);

  return <div>Загрузка файла...</div>;
};

export default FileDownloadPage;