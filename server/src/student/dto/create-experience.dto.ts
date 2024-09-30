export class CreateExperienceDto {
  studentId: number;
  type: 'professional' | 'academic';
  description: string;
  company_name: string;
  position: string;
  start_date: Date;
  end_date: Date | null;
}
