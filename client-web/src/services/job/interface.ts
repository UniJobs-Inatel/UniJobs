import {  JobPublication } from '@/domain/job';
export interface AvailablesIesResponse {
  id: number;
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