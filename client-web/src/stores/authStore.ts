import { create } from "zustand";
import { AuthResponse } from "@/domain/user";
import decodeJWT from "@/utils/jwt";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthResponse | null;
  saveAuthResponse: (
    accessToken: string,
    refreshToken: string,
  ) => void;
  clearTokens: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  saveAuthResponse: (accessToken, refreshToken) => {
    const user = decodeJWT<AuthResponse>(accessToken)?? null;

    set({ accessToken, refreshToken, user });
  },
  clearTokens: () => set({ accessToken: null, refreshToken: null, user:null }),
}));

export default useAuthStore;
