import { Tag } from "./tags";
import { User } from "./user";

export interface Experience {
    id?:number,
    type:'professional'| 'academic',
    description:string,
    student_id?:number,
    company_name:string,
    position: string,
    start_date?: string,
    end_date?:string,
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

export interface StudentProfile {
    id: 8;
    first_name: string;
    last_name: string;
    cpf: string;
    user: User,
    college: {
      id: number;
    };
    experiences: Experience[
    ];
    proficiencies: {
      student_id: number;
      tag_id: number;
    }[];
  }






