import { create } from "zustand";
import { AuthResponse, UserType } from "@/domain/user";
import decodeJWT from "@/utils/jwt";
import { getTypedLocalStorage } from "@/utils/typedLocalStorage";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthResponse | null;
  saveAuthResponse: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken:
    getTypedLocalStorage<Omit<AuthState, "saveAuthResponse" | "clearTokens">>(
      "session"
    )?.accessToken ?? null,
  refreshToken:
    getTypedLocalStorage<Omit<AuthState, "saveAuthResponse" | "clearTokens">>(
      "session"
    )?.refreshToken ?? null,
  user:
    getTypedLocalStorage<Omit<AuthState, "saveAuthResponse" | "clearTokens">>(
      "session"
    )?.user ?? null,
  saveAuthResponse: (accessToken, refreshToken) => {
    localStorage.removeItem("session");

    const user = decodeJWT<AuthResponse>(accessToken) ?? null;

    localStorage.setItem(
      "session",
      JSON.stringify({ user, accessToken, refreshToken })
    );

    set({ accessToken, refreshToken, user });

    if (user?.type == UserType.STUDENT) {
      window.location.href = "/vagas";
    }else{
      window.location.href = "/perfil-empresa";
    }
  },
  clearTokens: () => set({ accessToken: null, refreshToken: null, user: null }),
}));

export default useAuthStore;
