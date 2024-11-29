import instance from "@/lib/axios";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./interface";
import { ApiResponse } from "../inteface";
import { AxiosError } from "axios";

export const registerUser = async (data: RegisterRequest):Promise<ApiResponse<RegisterResponse>> => {
  try {
    const response = await instance.post("/auth/register", {
      email: data.email,
      password: data.password,
      type: data.role,
    });

    return {
      ...response.data,
      success:true
    }
  } catch (e) {
    return{
      error:'Erro ao se cadastratar',
      success:false
    }
  }
};

export const loginUser = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await instance.post<LoginResponse>("/auth/login", {
      email: data.email,
      password: data.password,
    });

    return { ...response.data, success: true };
  } catch (e:AxiosError | unknown) {
    
    return{
      error:e instanceof AxiosError && e.response ? e.response.data.message  :'Erro ao fazer login',
      success:false
    }

  }
};
