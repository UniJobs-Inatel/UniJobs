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
  company:Partial<IGetCompanyResponse>
  //company_id: number;
}
