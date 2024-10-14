import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import axios from 'axios';

const useAuth = () => {
  const { accessToken, refreshToken,saveAuthResponse, clearTokens } = useAuthStore();

  useEffect(() => {
    const refreshAccessToken = async () => {
      if (!refreshToken) return;

      try {
        const response = await axios.post('http://localhost:4000/api/auth/refresh-token', {
          refreshToken,
        });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        saveAuthResponse(newAccessToken, newRefreshToken);
      } catch (error) {
        console.error('Erro ao atualizar o token:', error);
        clearTokens();
      }
    };

    refreshAccessToken();
  }, [refreshToken, saveAuthResponse, clearTokens]);

  return {
    accessToken,
    refreshToken,
  };
};

export default useAuth;