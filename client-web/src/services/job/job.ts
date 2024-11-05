
import { Job } from "@/domain/job";
import instance from "@/lib/axios";
import { AvailablesIesResponse, publishJobRequest } from "./interface";

export const getJobsByCompany = async () => {
  try {
    const response = await instance.get<Job[]>(`/job/company`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAvailablesIEsByJob = async (jobId:number) => {
  try {
    const response = await instance.get<AvailablesIesResponse[]>(`/job/colleges/${jobId}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};


export const createJob = async (jobData: Job) => {
  try {
    const response = await instance.post(`/job`, jobData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    throw error;
  }
};

export const getAllJobs = async () => {
  try {
    const response = await instance.get(`/job`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    throw error;
  }
};

export const getJobById = async (id: string) => {
  try {
    const response = await instance.get(`/job/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar vaga com ID ${id}:`, error);
    throw error;
  }
};

export const updateJob = async (id: string, jobData: Job) => {
  try {
    const response = await instance.put(`/job/${id}`, jobData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar vaga com ID ${id}:`, error);
    throw error;
  }
};

export const deleteJob = async (id: number) => {
  try {
    return await instance.delete(`/job/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar vaga com ID ${id}:`, error);
    throw error;
  }
};

export const publishJob = async ({job_id, company_id, college_id}:publishJobRequest) => {
  try {
    const response = await instance.post(`/job/publish`, { job_id: job_id, company_id: company_id, college_id: college_id });
    return response;
  } catch (error) {
    console.error("Erro ao publicar vaga:", error);
    throw error;
  }
};
