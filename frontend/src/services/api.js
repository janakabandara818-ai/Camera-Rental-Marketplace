import axios from 'axios';
import { endSession, tokenExpiry } from '../utils/authSession';

const API = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:5000/api',
});

const isSignInRequest = (url = '') => /\/auth\/(login|register)\/?(?:\?.*)?$/.test(url);

API.interceptors.request.use((request) => {
  if (isSignInRequest(request.url)) return request;
  const token = localStorage.getItem('token');
  if (token && tokenExpiry(token) > Date.now()) {
    request.headers.Authorization = `Bearer ${token}`;
  } else if (token) {
    endSession('expired');
    delete request.headers.Authorization;
  }
  return request;
});

API.interceptors.response.use(
  response => response,
  error => {
    const currentToken = localStorage.getItem('token');
    const sentToken = error.config?.headers?.Authorization;
    if (error.response?.status === 401 && !isSignInRequest(error.config?.url) &&
        currentToken && sentToken === `Bearer ${currentToken}`) {
      endSession('expired');
    }
    // Network errors, 403 and 5xx responses do not erase a valid session.
    return Promise.reject(error);
  }
);

export default API;
