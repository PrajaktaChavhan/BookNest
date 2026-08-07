import { api } from './axiosInstance.js';

export const getWishlist = () => api.get('/api/wishlist');
export const addToWishlist = (listingId) => api.post('/api/wishlist/' + listingId);
export const removeFromWishlist = (listingId) => api.delete('/api/wishlist/' + listingId);
