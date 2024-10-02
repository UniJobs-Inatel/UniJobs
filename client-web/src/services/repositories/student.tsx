import { ICreateStudentProfile } from "@/domain/student";
import instance from "../api/axios";


export const createStudentProfile = async (creationData: ICreateStudentProfile) => {
  try {
    const response = await instance.post(`student/profile`, creationData);
    return response;
  } catch (error) {
    console.error(error);
  }
};
