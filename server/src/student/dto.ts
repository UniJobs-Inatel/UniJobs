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

export class UpdateStudentProfileDto {
  student: {
    first_name: string;
    last_name: string;
    cpf: string;
  };

  experiences: {
    id?: number;
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

export class CreateExperienceDto {
  studentId: number;
  type: 'professional' | 'academic';
  description: string;
  company_name: string;
  position: string;
  start_date: Date;
  end_date: Date | null;
}

export class UpdateExperienceDto {
  type?: 'professional' | 'academic';
  description?: string;
  company_name?: string;
  position?: string;
  start_date?: Date;
  end_date?: Date | null;
}

export class ListExperienceDto {
  id: number;
  type: 'professional' | 'academic';
  description: string;
  company_name: string;
  position: string;
  start_date: Date;
  end_date: Date | null;
}
