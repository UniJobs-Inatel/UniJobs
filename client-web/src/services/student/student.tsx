import instance from "@/lib/axios";
import { ICreateStudentProfileRequest, ICreateStudentProfileResponse, IUpdateStudentProfileRequest } from "./interface";
import { ApiResponse } from "../inteface";
import { StudentProfile } from "@/domain/student";

export const createStudentProfile = async (
  creationData: ICreateStudentProfileRequest
):Promise<ApiResponse<ICreateStudentProfileResponse>> => {
  try {
    const response = await instance.post(`student/profile`, creationData);
    return {...response.data, success:true};
  } catch (error) {
    console.error(error);
    return{success:false, error:'Erro ao salvar perfil'}
  }
};

export const updateStudentProfile = async (
  creationData: IUpdateStudentProfileRequest
):Promise<ApiResponse<ICreateStudentProfileResponse>> => {
  try {
    const response = await instance.put(`student/profile`, creationData);
    return {...response.data, success:true};
  } catch (error) {
    console.error(error);
    return{success:false, error:'Erro ao salvar perfil'}
  }
};

export const getStudentProfile = async (): Promise<
  ApiResponse<StudentProfile>
> => {
  try {
    const response = await instance.get(`student/profile`);
    return { ...response.data, success:true };
  } catch (error) {
    return { error:'Erro ao buscar perfil', success:false };
  }
};
