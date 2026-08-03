import { apiFetch } from './client';

export const getPosts = (queryString = '') => {
  const query = queryString ? (queryString.startsWith('?') ? queryString : `?${queryString}`) : '';
  return apiFetch(`/api/post/getposts${query}`);
};

export const createPost = (formData) => {
  return apiFetch('/api/post/create', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

export const updatePost = (postId, userId, formData) => {
  return apiFetch(`/api/post/updatepost/${postId}/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(formData),
  });
};

export const deletePost = (postId, userId) => {
  return apiFetch(`/api/post/deletepost/${postId}/${userId}`, {
    method: 'DELETE',
  });
};
