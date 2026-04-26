import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Add interceptor to include the AI key from localStorage if needed
// Or the user can provide it in a settings panel later.
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('ai_api_key');
  const userEmail = localStorage.getItem('userEmail');
  
  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }
  if (userEmail) {
    config.headers['x-user-email'] = userEmail;
  }
  return config;
});

export default api;
