import { apiFetch } from './client';

export const getPostComments = (postId) => {
  return apiFetch(`/api/comment/getPostComments/${postId}`);
};

export const createComment = (commentData) => {
  return apiFetch('/api/comment/create', {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
};

export const likeComment = (commentId) => {
  return apiFetch(`/api/comment/likeComment/${commentId}`, {
    method: 'PUT',
  });
};

export const editComment = (commentId, content) => {
  return apiFetch(`/api/comment/editComment/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
};

export const deleteComment = (commentId) => {
  return apiFetch(`/api/comment/deleteComment/${commentId}`, {
    method: 'DELETE',
  });
};

export const getComments = (queryString = '') => {
  const query = queryString ? (queryString.startsWith('?') ? queryString : `?${queryString}`) : '';
  return apiFetch(`/api/comment/getcomments${query}`);
};
