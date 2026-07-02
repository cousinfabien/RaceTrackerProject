import api from './api';

export const uploadScreenshot = async (
  file: File,
) => {
  const formData = new FormData();

  formData.append('file', file);

  const response = await api.post(
    '/uploads',
    formData,
    {
      headers: {
        'Content-Type':
          'multipart/form-data',
      },
    },
  );

  return response.data;
};

export const analyzeScreenshot = async (
  driverEntryId: number,
  filename: string,
) => {
  const response = await api.post(
    `/ocr/analyze/${driverEntryId}/${filename}`,
  );

  return response.data;
};
