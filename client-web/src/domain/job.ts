import { IGetCompanyResponse } from "@/services/company/interface";

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
