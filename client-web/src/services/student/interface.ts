import { Experience, Student } from "@/domain/student";
import { Tag } from "@/domain/tags";

export interface ICreateStudentProfileRequest {
  student: Partial<Student>;
  experiences: Experience[];
  proficiencies: Partial<Tag>[];
}

export interface IUpdateStudentProfileRequest extends ICreateStudentProfileRequest{}

export interface ICreateStudentProfileResponse extends ICreateStudentProfileRequest{}



