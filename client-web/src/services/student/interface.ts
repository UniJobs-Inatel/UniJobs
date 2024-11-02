import { Experience, Student } from "@/domain/student";
import { Tag } from "@/domain/tags";

export interface ICreateStudentProfileRequest{
    student:Partial<Student>,
     userId:number,
     experiences:Experience[];
     proficiencies:Partial<Tag>[];
 }