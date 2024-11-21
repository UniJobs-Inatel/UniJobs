import instance from "@/lib/axios";
import { ICreateCompanyProfileRequest, IGetCompanyResponse } from "./interface";
import { ApiResponse } from "../inteface";

export const createCompanyProfile = async (
  creationData: ICreateCompanyProfileRequest
): Promise<ApiResponse<IGetCompanyResponse>> => {
  try {
    const response = await instance.post(`/company/profile`, creationData);
    return { ...response.data, success:true };
  } catch (error) {
    console.error(error);
    return {
      error:'Erro ao salvar empresa',
      success:false
    }
  }
};

export const getCompanyData = async () => {
  try {
    const response =
      await instance.get<IGetCompanyResponse>(`/company/profile`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
