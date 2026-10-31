import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://finalround-hackathon-backend.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ensureAuthToken = async (): Promise<string> => {
  let token = localStorage.getItem('pulserelay_token');
  if (token && !token.startsWith('mock-') && token.length > 20) {
    return token;
  }
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'superadmin@pulserelay.org',
      password: 'Password@123',
    });
    token = res.data?.data?.token;
    if (token) {
      localStorage.setItem('pulserelay_token', token);
      return token;
    }
  } catch (err) {
    console.warn('Auto-authentication fallback error:', err);
  }
  return token || '';
};

apiClient.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('pulserelay_token');
    if (!token || token.startsWith('mock-')) {
      token = await ensureAuthToken();
    }
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('pulserelay_token');
      const newToken = await ensureAuthToken();
      if (newToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }
    // If backend is sleeping on Render Free tier, provide clear info
    if (error.code === 'ECONNABORTED' || error.message?.includes('Network Error')) {
      console.warn('Backend server may be waking up from Render free tier sleep...');
    }
    return Promise.reject(error);
  }
);

export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const healthUrl = (import.meta.env.VITE_API_URL || 'https://finalround-hackathon-backend.onrender.com').replace('/api/v1', '') + '/health';
    const res = await axios.get(healthUrl, { timeout: 8000 });
    return res.data?.status === 'healthy';
  } catch {
    return false;
  }
};
