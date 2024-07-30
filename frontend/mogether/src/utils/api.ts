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

    if (error.response.status === 401 && refreshToken) {  //refreshToken이 있을 때
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
  return response;  //api.ts에서 이미 localStorage에 accessToken, refreshToken을 저장했기 때문에 return response만 해주면 됨
};

export const registerApi = async (registerFormData: any) => {  //register 호출 시 registerFormData라는 객체 데이터를 받아옴
  const response = await api.post('/auth/register', registerFormData);
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

export const createMoimApi = async (postData: any) => {
  const response = await api.post('/posts', postData);
  return response;
};

export const createBungaeApi = async (postData: any) => {
  const response = await api.post('/bungae', postData);
  return response;
}

export const MoimCardApi = async (moimId: number) => {
  const response = await api.get(`/posts/${moimId}`);
  return response;
};

export const interestMoimApi = async (interest: any) => {
  const response = await api.post('/interest/moim', interest);
  return response;  // moim 관심 등록
}

export const interestMoimDeleteApi = async (interest: any) => {
  const response = await api.delete('/interest/moim', interest);
  return response;  // moim 관심 해제
}


export const interestBungaeApi = async (interest: any) => {
  const response = await api.post('/interest/bungae', interest);
  return response;
}

export const interestBungaeDeleteApi = async (interest: any) => {
  const response = await api.delete('/interest/moim', interest);
  return response;
}

export const userApi = async (userId: number) => {
  const response = await api.get(`/user/${userId}`);
  return response;
}

export const searchMoimApi = async (searchData: any) => {
  const response = await api.get(`/moim?name=${searchData.name}&city=${searchData.city}&gu=${searchData.gu}`);
  return response;
}

export const changePasswordApi = async (oldPassword: string, newPassword: string) => {
  const response = await api.post('/user/change-password', { oldPassword, newPassword });
  return response;
};

export const googleLoginApi = async (response: GoogleLoginResponse) => {
  const { tokenId } = response;
  const res = await api.post('/auth/google-login', { tokenId });
  const accessToken = res.headers['accessToken'].split(' ')[1];
  const refreshToken = res.headers['refreshToken'].split(' ')[1];
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  return res;
};

export const kakaoLoginApi = async (response: any) => {
  const { accessToken } = response;
  const res = await api.post('/auth/kakao-login', { accessToken });
  const newAccessToken = res.headers['accessToken'].split(' ')[1];
  const newRefreshToken = res.headers['refreshToken'].split(' ')[1];
  localStorage.setItem('accessToken', newAccessToken);
  localStorage.setItem('refreshToken', newRefreshToken);
  return res;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response;
}

export const MyCreateMoimListApi = async (userId: number) => {
  const response = await api.get(`'/${userId}/posts'`);
  return response;  //내가 등록한 모임 리스트
}

export const MyCreateBungaeListApi = async (userId: number) => {
  const response = await api.get(`'/${userId}/posts'`);
  return response;
}

export const MoimInterestApi = async (userId: number) => {
  const response = await api.get(`/${userId}/interest`);
  return response;   //내가 관심있다고 체크한 모임 리스트
}

export const BungaeInterestApi = async (userId: number) => {
  const response = await api.get(`/${userId}/bungae`);
  return response;
}

export const joinMoimApi = async (join: any) => {
  const response = await api.post(`/moim/${join.moimId}/join`, join.userId);
  return response;  //참여 신청
} 

export const joinQuitMoimApi = async (join: any) => {
  const response = await api.delete('/moim/quit', join);
  return response;
}

export const joinBungaeApi = async (join: any) => {
  const response = await api.post(`/bungae/${join.bungaeId}/join`, join.userId);
  return response;
}

export const joinQuitBungaeApi = async (join: any) => {
  const response = await api.delete('/bungae/quit', join);
}

export const changeUserProfile = async (profileData: any) => {
  const response = await api.patch(`/user/${profileData.userId}`, profileData.data);
  return response;
}




