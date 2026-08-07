import axios from 'axios';

// withCredentials: true is essential - without it, the browser will NOT
// send our httpOnly auth cookie on requests to the backend, since frontend
// (5173) and backend (5000) are different origins.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Unwraps our backend's consistent {success, message, data} envelope so
// every API call site gets clean data back, not a wrapper to unwrap
// manually every time.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const apiError = error.response?.data?.error || { message: 'Something went wrong' };
    return Promise.reject(apiError);
  }
);
