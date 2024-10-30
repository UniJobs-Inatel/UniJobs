import instance from "@/lib/axios";
import { ICreateStudentProfileRequest } from "./interface";



export const createStudentProfile = async (creationData: ICreateStudentProfileRequest) => {
  try {
    const response = await instance.post(`student/profile`, creationData);
    return response;
  } catch (error) {
    console.error(error);
  }
};
