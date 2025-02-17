const API_BASE_URL = 'http://localhost:5000/api';

const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Basic CRUD operations
export const get = (url) => fetchApi(url);
export const post = (url, data) =>
  fetchApi(url, { method: 'POST', body: JSON.stringify(data) });
export const put = (url, data) =>
  fetchApi(url, { method: 'PUT', body: JSON.stringify(data) });
export const del = (url) => fetchApi(url, { method: 'DELETE' });

// File upload helper
export const uploadFile = (url, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetchApi(url, {
    method: 'POST',
    headers: {},
    body: formData,
  });
};
