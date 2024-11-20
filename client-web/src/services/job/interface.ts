import {  Job, JobPublication } from '@/domain/job';
import { IGetCompanyResponse } from '../company/interface';
export interface AvailablesIesResponse {
  id: number;
  company:Partial<IGetCompanyResponse>
}

export interface PublishJobRequest {
  job_id: number;
  college_id: number;
}

export interface JobPublicationResponse extends JobPublication {}
export interface ValidateJobRequest {
  status:'approved' | 'reproved';
  jobPublicationId:number;
}
export interface UnpublishJobRequest {
  status:'removed';
  jobPublicationId:number;
}

export interface GetJobsByCompanyResponse{
  jobs:Job[]
}
export interface GetAllJobToValidateResponse{
  jobPublications:JobPublication[]
}

export interface GetStudentsJobPublicationList extends GetAllJobToValidateResponse{}
export interface GetCompanyJobPublicationList extends GetAllJobToValidateResponse{}