import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import axios from 'axios';

const useAuth = () => {
  const { accessToken, refreshToken, setTokens, clearTokens } = useAuthStore();

  useEffect(() => {
    const refreshAccessToken = async () => {
      if (!refreshToken) return;

      try {
        const response = await axios.post('http://localhost:4000/api/auth/refresh-token', {
          refreshToken,
        });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        setTokens(newAccessToken, newRefreshToken);
      } catch (error) {
        console.error('Erro ao atualizar o token:', error);
        clearTokens();
      }
    };

    // Pode implementar lógica de verificação de expiração aqui
    refreshAccessToken();
  }, [refreshToken, setTokens, clearTokens]);

  return {
    accessToken,
    refreshToken,
  };
};

export default useAuth;