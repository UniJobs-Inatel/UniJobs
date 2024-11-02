import instance from "@/lib/axios";
import { ICreateCompanyProfileRequest, IGetCompanyResponse } from "./interface";

export const createCompanyProfile = async (creationData: ICreateCompanyProfileRequest) => {
  try {
    const response = await instance.post(`/company/profile`, creationData);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getCompanyData = async () => {
  try {
    const response = await instance.get<IGetCompanyResponse>(`/company/profile`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

