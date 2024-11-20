
import { Job, JobFilters, JobPublication } from "@/domain/job";
import instance from "@/lib/axios";
import {
  AvailablesIesResponse,
  GetAllJobToValidateResponse,
  GetCompanyJobPublicationList,
  GetJobsByCompanyResponse,
  GetStudentsJobPublicationList,
  JobPublicationResponse,
  PublishJobRequest,
  UnpublishJobRequest,
  ValidateJobRequest,
} from "./interface";
import { ApiResponse } from "../inteface";

export const getJobsByCompany = async (companyId: number) => {
  try {
    const response = await instance.get<JobPublication[]>(`/job/publications/student`);
    return {
      jobPublications: response.data,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao buscar vagas",
    };
  }
};

export const getAvailablesIEsByJob = async (jobId: number) => {
  try {
    const response = await instance.get<AvailablesIesResponse[]>(
      `/job/colleges/${jobId}`
    );
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

export const getJobPublications = async (filters?: JobFilters) => {
  try {
    const params = new URLSearchParams();

    if (filters) {
      filters.field_id && filters.field_id !== 'todos' && params.append('fieldId', filters.field_id)
      filters.mode && filters.mode !== 'todos' && params.append('mode', filters.mode)
      filters.requirements && params.append('requirements', filters.requirements)
      filters.minSalary && params.append('minSalary', filters.minSalary)
      filters.maxSalary && params.append('maxSalary', filters.maxSalary)
      filters.type && filters.type !== 'todos' && params.append('type', filters.type)
      filters.weekly_hours && params.append('weeklyHours', filters.weekly_hours)
      filters.location && params.append('location', filters.location)
    }

    const response = await instance.get(`/job/publications/search`, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    throw error;
  }
};

export const getJobPublicationsStudent = async (filters?: JobFilters) => {
  try {
    const params = new URLSearchParams();

    if (filters) {
      filters.field_id && filters.field_id !== 'todos' && params.append('fieldId', filters.field_id)
      filters.mode && filters.mode !== 'todos' && params.append('mode', filters.mode)
      filters.requirements && params.append('requirements', filters.requirements)
      filters.minSalary && params.append('minSalary', filters.minSalary)
      filters.maxSalary && params.append('maxSalary', filters.maxSalary)
      filters.type && filters.type !== 'todos' && params.append('type', filters.type)
      filters.weekly_hours && params.append('weeklyHours', filters.weekly_hours)
      filters.location && params.append('location', filters.location)
    }

    const response = await instance.get(`/job/publications/student/search`, { params });
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

export const publishJob = async ({
  job_id,
  college_id,
}: PublishJobRequest): Promise<ApiResponse<JobPublication>> => {
  try {
    const response = await instance.post(`/job/publish`, {
      job_id: job_id,
      college_id: college_id,
    });
    return { ...response.data, success: true };
  } catch (error) {
    console.error("Erro ao publicar vaga:", error);
    return{
      success:false,
      error:'Erro ao publicar'
    }
  }
};

export const getAllJobToValidate = async (): Promise<
  ApiResponse<GetAllJobToValidateResponse>
> => {
  try {
    const response = await instance.get<JobPublicationResponse[]>(
      `/job/publications/college`
    );
    return {jobPublications:response.data, success:true}
  } catch (error) {
    console.error("Erro ao buscar vagas pendentes:", error);
    return {error:"Erro ao buscar vagas pendentes", success:false}
    
  }
};

export const validateJob = async ({
  status,
  jobPublicationId,
}: ValidateJobRequest): Promise<ApiResponse<JobPublicationResponse>> => {
  try {
    const response = await instance.put<JobPublicationResponse>(
      `/job/publications/${jobPublicationId}`,
      { status }
    );
    return {
      ...response.data,
      success: true,
    };
  } catch (error) {
    console.error("Erro ao publicar vaga:", error);
    throw error;
  }
};

export const favoriteJob = async (jobId: number) => {
  try {
    const response = await instance.post(`/student/favorite-job/${jobId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unfavoriteJob = async (jobId: number) => {
  try {
    await instance.delete(`/student/favorite-job/${jobId}`);
  } catch (error) {
    throw error;
  }
};

export const getFavoriteJobs = async () => {
  try {
    const response = await instance.get(`/student/favorite-jobs`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
