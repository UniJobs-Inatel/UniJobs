export class CreateCompanyDto {
  name: string;
  description: string;
  cnpj: string;
  field_of_activity: string;
  contact_website?: string;
  user_id: number;
}

export class UpdateCompanyDto {
  name?: string;
  description?: string;
  cnpj?: string;
  field_of_activity?: string;
  contact_website?: string;
}
