import { Tag } from "./tags";

export interface Experience {
    id?:number,
    type:'professional'| 'academic',
    description:string,
    student_id?:number,
    company_name:string,
    position: string,
    start_date?: Date,
    end_date?:Date,
}

export interface Student {
    id:number,
    first_name:string,
    last_name:string ,
    cpf:string,
    user_id:string,
    college_id:string,
    experiences:Experience;
    proficiencies:Tag[];
}




