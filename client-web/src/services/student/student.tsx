import instance from "@/lib/axios";
import { ICreateStudentProfileRequest } from "./interface";
import { ApiResponse } from "../inteface";
import { StudentProfile } from "@/domain/student";

export const createStudentProfile = async (
  creationData: ICreateStudentProfileRequest
) => {
  try {
    const response = await instance.post(`student/profile`, creationData);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getStudentProfile = async (): Promise<
  ApiResponse<StudentProfile>
> => {
  try {
    const response = await instance.get(`student/profile/`);
    return { ...response.data, success:true };
  } catch (error) {
    return { error:'Erro ao buscar perfil', success:false };
  }
};
