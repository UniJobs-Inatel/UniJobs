
import { Job } from "@/domain/job";
import instance from "../api/axios"

export const getJobsByCompany = async (companyId:number) => {
  try {
    const response = await instance.get<Job[]>(`/job/company/${companyId}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
