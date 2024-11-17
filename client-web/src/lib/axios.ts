import useAuthStore from "@/stores/authStore";
import axios, { AxiosError } from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 30000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
  },
});

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const failedRequest = error.config;

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL as string}auth/refresh-token`,
          {
            refreshToken: useAuthStore.getState().refreshToken,
          }
        );

        if (response.status !== 200) {
          window.location.href = '/';
          return Promise.reject(error);
        }

        const { accessToken, refreshToken } = response.data;

        useAuthStore.getState().saveAuthResponse(accessToken, refreshToken);

        instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        if (failedRequest) {
          if (failedRequest.headers) {
            failedRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          }
          return instance(failedRequest); 
        }
      } catch (refreshError) {
        console.error("Erro ao atualizar o token:", refreshError);
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export interface ErrorResponse {
  message: string;
}

export default instance;
