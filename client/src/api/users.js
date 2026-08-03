import { apiFetch } from './client';

export const signOut = () => {
  return apiFetch('/api/user/signout', {
    method: 'POST',
  });
};

export const getUsers = (queryString = '') => {
  const query = queryString ? (queryString.startsWith('?') ? queryString : `?${queryString}`) : '';
  return apiFetch(`/api/user/getusers${query}`);
};

export const deleteUser = (userId) => {
  return apiFetch(`/api/user/delete/${userId}`, {
    method: 'DELETE',
  });
};

export const updateUser = (userId, formData) => {
  return apiFetch(`/api/user/update/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(formData),
  });
};

export const getUserById = (userId) => {
  return apiFetch(`/api/user/${userId}`);
};
