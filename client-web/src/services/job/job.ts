import { Job, JobPublication } from "@/domain/job";
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

export const getJobsByCompany = async (): Promise<
  ApiResponse<GetJobsByCompanyResponse>
> => {
  try {
    const response = await instance.get<Job[]>(`/job/company`);
    return {
      jobs: response.data,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao buscar vagas",
    };
  }
};

export const getStudentsJobPublicationList = async (): Promise<
  ApiResponse<GetStudentsJobPublicationList>
> => {
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

    return {
      success: false,
      error: "Erro ao validar vaga",
    };
  }
};

export const unpublishJob = async ({
  status,
  jobPublicationId,
}: UnpublishJobRequest): Promise<ApiResponse<JobPublicationResponse>> => {
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
    console.error("Erro ao despublicar vaga:", error);

    return {
      success: false,
      error: "Erro ao despublicar vaga",
    };
  }
};

export const getJobsPublicationByCompany = async (): Promise<
  ApiResponse<GetCompanyJobPublicationList>
> => {
  try {
    const response = await instance.get<JobPublication[]>(`/job/publications/company`);
    return {
      jobPublications: response.data,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao buscar vagas publicadas",
    };
  }
};


