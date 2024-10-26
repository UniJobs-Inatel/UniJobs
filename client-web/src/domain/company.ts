import { User } from "./user";

export interface ICompany{
    id?:number;
    name:string;
    cnpj:string;
    description:string;
    field_of_activity:string;
    contact_website:string;
}

export interface ICreateCompanyProfile extends ICompany{
    user_id:number;
 }

 export interface  ICompanyResponse extends ICompany {
    user:User;
 }