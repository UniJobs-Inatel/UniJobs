
import { Job } from "@/domain/job";
import instance from "@/lib/axios";
import { JobData } from "@/pages/jobForm";

export const getJobsByCompany = async (companyId:number) => {
  try {
    const response = await instance.get<Job[]>(`/job/company/${companyId}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};


export const createJob = async (jobData: JobData) => {
  try {
    const response = await instance.post(`jobs`, jobData);
    return response;
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    throw error;
  }
};

export const getAllJobs = async () => {
  try {
    const response = await instance.get(`jobs`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    throw error;
  }
};

export const getJobById = async (id: string) => {
  try {
    const response = await instance.get(`jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar vaga com ID ${id}:`, error);
    throw error;
  }
};

export const updateJob = async (id: string, jobData: JobData) => {
  try {
    const response = await instance.put(`jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar vaga com ID ${id}:`, error);
    throw error;
  }
};

export const deleteJob = async (id: string) => {
  try {
    const response = await instance.delete(`jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar vaga com ID ${id}:`, error);
    throw error;
  }
};
