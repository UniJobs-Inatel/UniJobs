import { IGetCompanyResponse } from "@/services/company/interface"

export interface JobPublication {
  id: number
  job: Job
  publication_date: string
  publication_request_date: string
  status: string
}

export interface Job {
  id?: number;
  job_name: string;
  type: "freelance" | "trainee" | "clt" | "pj" | "internship";
  description: string;
  location: string;
  weekly_hours: number;
  mode: "on_site" | "hybrid" | "remote";
  benefits: string;
  salary: number;
  requirements: string;
  field_id?: number;
  isPublishedOnAllColleges:boolean;
  company:Partial<IGetCompanyResponse>
  field?: {
    id: number;
    field: string;
  }
  //company_id: number;
}

export interface JobFilters {
  type: string
  minSalary: string
  maxSalary: string
  requirements: string
  mode: string
  weekly_hours: string
  field_id: string
  location: string
}