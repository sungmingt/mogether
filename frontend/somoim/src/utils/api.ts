import axios from 'axios';

const API_BASE_URL = 'https://example.com/api'; // 백엔드 임시 서버

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const updateProfileApi = async (profile: any) => {
  const response = await api.put('/users/profile', profile);
  return response.data;
};
