import { User } from "@/domain/user";

export interface ICreateCompanyProfileRequest{
    name:string;
    cnpj:string;
    description:string;
    field_of_activity:string;
    contact_website:string;
    user_id:number;
 }

 export interface IGetCompanyResponse  {
    id?: number;
    name: string;
    cnpj: string;
    description: string;
    field_of_activity: string;
    contact_website: string;
    user: User;
  }