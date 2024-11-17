export class UpdateJobDto {
  job_name?: string;
  description?: string;
  location?: string;
  type?: 'freelance' | 'trainee' | 'clt' | 'pj' | 'internship';
  weekly_hours?: number;
  mode?: 'on_site' | 'hybrid' | 'remote';
  benefits?: string;
  salary?: number;
  requirements?: string;
  field_id?: number;
}
