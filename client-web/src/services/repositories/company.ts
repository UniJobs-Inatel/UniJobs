import { ICreateCompanyProfile } from '../../domain/company';

import instance from "../api/axios"



export const createCompanyProfile = async (creationData: ICreateCompanyProfile) => {
  try {
    const response = await instance.post(`/company/profile`, creationData);
    return response;
  } catch (error) {
    console.error(error);
  }
};
