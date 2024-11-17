import instance from "@/lib/axios";
import { LoginRequest, LoginResponse, RegisterRequest } from "./interface";
import axios from "axios";

export const registerUser = async (data: RegisterRequest) => {
    try{
        const response = await instance.post("/auth/register", {
          email: data.email,
          password: data.password,
          type: data.role,
        });
        console.log(response)
    }catch(e){
      console.log('ERRRO')

        throw new Error(axios.isAxiosError(e)
        ? e.response?.data.message
        : "Erro ao abrir fazer registro")
    }
};

export const loginUser = async (data: LoginRequest):Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>("/auth/login", {
    email: data.email,
    password: data.password,
  });

  return response.data;

};
