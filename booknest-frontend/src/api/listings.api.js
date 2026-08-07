import { api } from './axiosInstance.js';

export const searchListings = (params) => api.get('/api/listings', { params });
export const getListing = (id) => api.get(`/api/listings/${id}`);

export const createListing = (formValues, imageFiles = []) => {
  const formData = new FormData();
  Object.entries(formValues).forEach(([key, value]) => {
    if (value !== undefined && value !== '') formData.append(key, value);
  });
  imageFiles.forEach((file) => formData.append('images', file));

  return api.post('/api/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateListingStatus = (id, status) =>
  api.patch(`/api/listings/${id}/status`, { status });

export const deleteListing = (id) => api.delete(`/api/listings/${id}`);
