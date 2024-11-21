import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PopulateDatabaseService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async populateDatabase(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      await queryRunner.query(`
        -- Insert default users
        INSERT INTO "user" (email, password, status, type)
        VALUES 
        ('manu@gec.inatel.br', '$2a$10$dXFaDjDB58h0RJpBqu4Wg.ngMCJea/0JPisDE86Sw3A.Z4K/GrLF2', 'complete', 'student'),
        ('juli@ges.inatel.br', '$2a$10$dXFaDjDB58h0RJpBqu4Wg.ngMCJea/0JPisDE86Sw3A.Z4K/GrLF2', 'complete', 'student'),
        ('inatel@college.com', '$2a$10$dXFaDjDB58h0RJpBqu4Wg.ngMCJea/0JPisDE86Sw3A.Z4K/GrLF2', 'complete', 'college'),
        ('techcorp@company.com', '$2a$10$dXFaDjDB58h0RJpBqu4Wg.ngMCJea/0JPisDE86Sw3A.Z4K/GrLF2', 'complete', 'company');
      
        -- Insert default company
        INSERT INTO company (name, description, cnpj, field_of_activity, contact_website, user_id)
        VALUES 
        ('TechCorp', 'A technology company', '12345678000191', 'Technology', 'http://tech.corp', (SELECT id FROM "user" WHERE email = 'techcorp@company.com'));

        -- Insert default college
        INSERT INTO company (name, description, cnpj, field_of_activity, contact_website, user_id)
        VALUES 
        ('Inatel', 'A technology school', '12345678000192', 'Technology', 'http://inatel.br', (SELECT id FROM "user" WHERE email = 'inatel@college.com'));

        INSERT INTO college (company_id)
        VALUES ((SELECT id FROM company WHERE name = 'Inatel'));

        -- Insert default valid emails
        INSERT INTO valid_email (domain, college_id)
        VALUES 
        ('gec.inatel.br', (SELECT id FROM college WHERE company_id = (SELECT id FROM company WHERE name = 'Inatel'))),
        ('ges.inatel.br', (SELECT id FROM college WHERE company_id = (SELECT id FROM company WHERE name = 'Inatel')));

        -- Insert default students
        INSERT INTO student (first_name, last_name, cpf, user_id, college_id)
        VALUES 
        ('Manuela', 'Gripp', '12345678901', (SELECT id FROM "user" WHERE email = 'manu@gec.inatel.br'), (SELECT id FROM college WHERE company_id = (SELECT id FROM company WHERE name = 'Inatel'))),
        ('Matheus', 'Julidori', '12345678902', (SELECT id FROM "user" WHERE email = 'juli@ges.inatel.br'), (SELECT id FROM college WHERE company_id = (SELECT id FROM company WHERE name = 'Inatel')));

        -- Insert default experiences
        INSERT INTO experience (type, description, student_id, company_name, position, start_date, end_date)
        VALUES 
        ('professional', 'Internship at TechCorp', (SELECT id FROM student WHERE first_name = 'Manuela'), 'TechCorp', 'Intern', '2021-01-01', '2021-12-31'),
        ('professional', 'Internship at TechCorp', (SELECT id FROM student WHERE first_name = 'Matheus'), 'TechCorp', 'Intern', '2021-01-01', '2021-12-31');

        -- Insert default jobs
        INSERT INTO job (job_name, description, location, type, weekly_hours, mode, benefits, salary, requirements, field_id, company_id)
        VALUES 
        ('Software Developer Intern', 'Develop software', 'Santa Rita do Sapucaí', 'clt', 40, 'remote', 'Health insurance', 3000.00, '1 year experience', (SELECT id FROM field WHERE field = 'it'), (SELECT id FROM company WHERE name = 'TechCorp')),
        ('Software Developer', 'Develop software', 'Santa Rita do Sapucaí', 'clt', 40, 'remote', 'Health insurance', 5000.00, '3 years experience', (SELECT id FROM field WHERE field = 'it'), (SELECT id FROM company WHERE name = 'TechCorp')),
        ('Backend Javascript Intern', 'Develop software', 'Santa Rita do Sapucaí', 'clt', 40, 'remote', 'Health insurance', 3000.00, '1 year experience', (SELECT id FROM field WHERE field = 'it'), (SELECT id FROM company WHERE name = 'TechCorp')),
        ('Frontend Javascript Intern', 'Develop software', 'Santa Rita do Sapucaí', 'clt', 40, 'remote', 'Health insurance', 3000.00, '1 year experience', (SELECT id FROM field WHERE field = 'it'), (SELECT id FROM company WHERE name = 'TechCorp'));

        -- Insert default job publications
        INSERT INTO job_publication (job_id, college_id, company_id, status, publication_request_date, publication_date)
        VALUES 
        ((SELECT id FROM job WHERE job_name = 'Software Developer'), (SELECT id FROM college WHERE company_id = (SELECT id FROM company WHERE name = 'Inatel')), (SELECT id FROM company WHERE name = 'TechCorp'), 'approved', '2021-01-01', '2021-01-02'),
        ((SELECT id FROM job WHERE job_name = 'Software Developer Intern'), (SELECT id FROM college WHERE company_id = (SELECT id FROM company WHERE name = 'Inatel')), (SELECT id FROM company WHERE name = 'TechCorp'), 'pending', '2021-01-01', '2021-01-02');

        -- Insert default tags
        INSERT INTO tag (name)
        VALUES 
        ('Java'),
        ('Python'),
        ('C++'),
        ('JavaScript'),
        ('TypeScript'),
        ('HTML'),
        ('CSS'),
        ('React'),
        ('Angular'),
        ('Vue'),
        ('Node.js'),
        ('Spring'),
        ('Django'),
        ('Flask'),
        ('Express'),
        ('MongoDB'),
        ('PostgreSQL'),
        ('MySQL'),
        ('SQL Server'),
        ('Oracle'),
        ('NoSQL'),
        ('REST'),
        ('GraphQL'),
        ('Docker'),
        ('Kubernetes'),
        ('AWS'),
        ('Azure'),
        ('GCP'),
        ('CI/CD'),
        ('Git'),
        ('Agile'),
        ('Scrum'),
        ('Kanban'),
        ('DevOps'),
        ('TDD'),
        ('BDD'),
        ('DDD'),
        ('Microservices'),
        ('Serverless'),
        ('Frontend'),
        ('Backend'),
        ('Fullstack'),
        ('Mobile'),
        ('Web'),
        ('Desktop'),
        ('Embedded'),
        ('Cloud'),
        ('Big Data'),
        ('Machine Learning'),
        ('Data Science'),
        ('Artificial Intelligence'),
        ('Cybersecurity'),
        ('Blockchain'),
        ('Game Development'),
        ('Quality Assurance'),
        ('UX/UI');

        -- Insert default job tags
        INSERT INTO job_tag (job_id, tag_id)
        VALUES 
        ((SELECT id FROM job WHERE job_name = 'Software Developer'), (SELECT id FROM tag WHERE name = 'Python')),
        ((SELECT id FROM job WHERE job_name = 'Software Developer'), (SELECT id FROM tag WHERE name = 'Docker')),
        ((SELECT id FROM job WHERE job_name = 'Software Developer'), (SELECT id FROM tag WHERE name = 'AWS')),
        ((SELECT id FROM job WHERE job_name = 'Software Developer'), (SELECT id FROM tag WHERE name = 'Frontend')),
        ((SELECT id FROM job WHERE job_name = 'Software Developer'), (SELECT id FROM tag WHERE name = 'Backend')),
        ((SELECT id FROM job WHERE job_name = 'Software Developer Intern'), (SELECT id FROM tag WHERE name = 'Python')),
        ((SELECT id FROM job WHERE job_name = 'Software Developer Intern'), (SELECT id FROM tag WHERE name = 'Docker')),
        ((SELECT id FROM job WHERE job_name = 'Software Developer Intern'), (SELECT id FROM tag WHERE name = 'AWS')),
        ((SELECT id FROM job WHERE job_name = 'Software Developer Intern'), (SELECT id FROM tag WHERE name = 'Frontend')),
        ((SELECT id FROM job WHERE job_name = 'Software Developer Intern'), (SELECT id FROM tag WHERE name = 'Backend')),
        ((SELECT id FROM job WHERE job_name = 'Backend Javascript Intern'), (SELECT id FROM tag WHERE name = 'JavaScript')),
        ((SELECT id FROM job WHERE job_name = 'Backend Javascript Intern'), (SELECT id FROM tag WHERE name = 'Node.js')),
        ((SELECT id FROM job WHERE job_name = 'Backend Javascript Intern'), (SELECT id FROM tag WHERE name = 'Express')),
        ((SELECT id FROM job WHERE job_name = 'Backend Javascript Intern'), (SELECT id FROM tag WHERE name = 'MongoDB')),
        ((SELECT id FROM job WHERE job_name = 'Frontend Javascript Intern'), (SELECT id FROM tag WHERE name = 'JavaScript')),
        ((SELECT id FROM job WHERE job_name = 'Frontend Javascript Intern'), (SELECT id FROM tag WHERE name = 'React')),
        ((SELECT id FROM job WHERE job_name = 'Frontend Javascript Intern'), (SELECT id FROM tag WHERE name = 'Angular')),
        ((SELECT id FROM job WHERE job_name = 'Frontend Javascript Intern'), (SELECT id FROM tag WHERE name = 'Vue'));

        -- Insert default student proficiencies
        INSERT INTO student_proficiency (student_id, tag_id)
        VALUES 
        ((SELECT id FROM student WHERE first_name = 'Manuela'), (SELECT id FROM tag WHERE name = 'TypeScript')),
        ((SELECT id FROM student WHERE first_name = 'Manuela'), (SELECT id FROM tag WHERE name = 'HTML')),
        ((SELECT id FROM student WHERE first_name = 'Manuela'), (SELECT id FROM tag WHERE name = 'CSS')),
        ((SELECT id FROM student WHERE first_name = 'Manuela'), (SELECT id FROM tag WHERE name = 'React')),
        ((SELECT id FROM student WHERE first_name = 'Manuela'), (SELECT id FROM tag WHERE name = 'Frontend')),
        ((SELECT id FROM student WHERE first_name = 'Matheus'), (SELECT id FROM tag WHERE name = 'TypeScript')),
        ((SELECT id FROM student WHERE first_name = 'Matheus'), (SELECT id FROM tag WHERE name = 'Docker')),
        ((SELECT id FROM student WHERE first_name = 'Matheus'), (SELECT id FROM tag WHERE name = 'AWS')),
        ((SELECT id FROM student WHERE first_name = 'Matheus'), (SELECT id FROM tag WHERE name = 'Express')),
        ((SELECT id FROM student WHERE first_name = 'Matheus'), (SELECT id FROM tag WHERE name = 'Backend'));
        `);

      await queryRunner.commitTransaction();
    } catch (error) {
      console.error('Error populating database:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
