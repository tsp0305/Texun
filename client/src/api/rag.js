import { apiFetch } from './client';

export const uploadPdfSource = (formData) => {
  return apiFetch('http://localhost:5000/api/pdf/upload', {
    method: 'POST',
    body: formData, // formData will automatically be handled correctly by apiFetch (Multipart)
  });
};

export const generateRagContent = (payload) => {
  return apiFetch('http://localhost:5000/api/rag/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
