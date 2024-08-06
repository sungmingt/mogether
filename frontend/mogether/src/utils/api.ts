import axios from 'axios';
import { GoogleLoginResponse } from 'react-google-login';

const API_BASE_URL = 'http://api.mo-gether.site:8080'; // 백엔드 서버의 기본 URL

// Axios 인스턴스 생성
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 -> 보낼 때 중간에 가로쳐서 토큰을 넣어줌
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');

    if (error.response.status === 401 && refreshToken) {
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        const newAccessToken = data.accessToken.split(' ')[1];  //`Bearer ${} 이런 식을 보내지면

        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// API 요청 함수들
export const loginApi = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const accessToken = response.headers['accessToken'].split(' ')[1];
  const refreshToken = response.headers['refreshToken'].split(' ')[1];
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  return response;
};

export const registerApi = async (name: string, email: string, password: string) => {  //register 호출 시 인자 3개를 받아옴
  const response = await api.post('/auth/register', { name: name, email: email, password: password });
  // localStorage.setItem('accessToken', response.data.accessToken);
  // localStorage.setItem('refreshToken', response.data.refreshToken);
  return response;
};

export const fetchUserProfileApi = async () => {
    const response = await api.get('/user/profile');
    return response;
  };

export const fetchPostsApi = async () => {
  const response = await api.get('/posts');
  return response;
};

export const createPostApi = async (postData: any) => {
  const response = await api.post('/posts', postData);
  return response;
};

export const PostCardApi = async (moimId: number) => {
  const response = await api.get(`/posts/${moimId}`);
  return response;
};

export const interestApi = async (interest: any) => {
  const response = await api.post('/interest/moim', interest);
  return response
}

export const userApi = async (userId: number) => {
  const response = await api.get(`/user/${userId}`);
  return response;
}

export const searchPostApi = async (searchData: any) => {
  const response = await api.get(`/moim?name=${searchData.name}&city=${searchData.city}&gu=${searchData.gu}`);
  return response;
}





