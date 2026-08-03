import { apiFetch } from './client';

export const signUp = (formData) => {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

export const signIn = (formData) => {
  return apiFetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

export const googleAuth = (payload) => {
  return apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
