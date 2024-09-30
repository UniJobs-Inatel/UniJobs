export class CreateStudentProfileDto {
  userId: number;
  student: {
    first_name: string;
    last_name: string;
    cpf: string;
  };

  experiences: {
    type: 'professional' | 'academic';
    description: string;
    company_name: string;
    position: string;
    start_date: Date;
    end_date: Date | null;
  }[];

  proficiencies: {
    id: number;
  }[];
}
