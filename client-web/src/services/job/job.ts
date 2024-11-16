
import { Job, JobFilters } from "@/domain/job";
import instance from "@/lib/axios";

export const getJobsByCompany = async (companyId: number) => {
  try {
    const response = await instance.get<Job[]>(`/job/company/${companyId}`);
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
    }

    const response = await instance.get(`/job/publications/search`, { params });
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

export const deleteJob = async (id: string) => {
  try {
    await instance.delete(`/job/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar vaga com ID ${id}:`, error);
    throw error;
  }
};

export const publishJob = async (jobId: number, companyId: number, collegeId: number) => {
  try {
    const response = await instance.post(`/job/publish`, { job_id: jobId, company_id: companyId, college_id: collegeId });
    return response.data;
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
