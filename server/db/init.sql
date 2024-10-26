DROP DATABASE IF EXISTS unijobs;
CREATE DATABASE unijobs;
\c unijobs;

-- Table: "user"
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('created', 'confirmed', 'complete')) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('student', 'college', 'company')) NOT NULL
);

-- Table: student
CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    user_id INT,
    college_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES college(id) ON DELETE SET NULL
);

-- Table: experience
CREATE TABLE experience (
    id SERIAL PRIMARY KEY,
    type VARCHAR(12) CHECK (type IN ('professional', 'academic')) NOT NULL,
    description TEXT NOT NULL,
    student_id INT,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);

-- Table: company
CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    field_of_activity VARCHAR(100) NOT NULL,
    contact_website VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Table: college
CREATE TABLE college (
    id SERIAL PRIMARY KEY,
    company_id INT,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
);

-- Table: valid_email
CREATE TABLE valid_email (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    college_id INT,
    FOREIGN KEY (college_id) REFERENCES college(id) ON DELETE CASCADE
);

-- Table: field
CREATE TABLE field (
    id SERIAL PRIMARY KEY,
    field VARCHAR(20) CHECK (field IN ('it', 'engineering', 'exact_sciences', 'humanities', 'business', 'health', 'arts', 'agriculture', 'law', 'education')) NOT NULL
);

-- Future implementations will require this table
-- Table: course
CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    field_id INT,
    name VARCHAR(100) NOT NULL,
    college_id INT,
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES college(id) ON DELETE CASCADE
);

-- Table: job
CREATE TABLE job (
    id SERIAL PRIMARY KEY,
    job_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('freelance', 'trainee', 'clt', 'pj', 'internship')) NOT NULL,
    weekly_hours INT NOT NULL,
    mode VARCHAR(10) CHECK (mode IN ('on_site', 'hybrid', 'remote')) NOT NULL,
    benefits TEXT,
    salary NUMERIC(10, 2),
    requirements TEXT NOT NULL,
    field_id INT,
    company_id INT,
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
);

-- Table: service
CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    college_id INT,
    student_id INT,
    FOREIGN KEY (college_id) REFERENCES college(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);

-- Table: job_publication
CREATE TABLE job_publication (
    id SERIAL PRIMARY KEY,
    job_id INT,
    college_id INT,
    company_id INT,
    status VARCHAR(10) CHECK (status IN ('pending', 'approved', 'reproved', 'removed')) DEFAULT 'pending',
    publication_request_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    publication_date TIMESTAMPTZ,
    FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES college(id) ON DELETE SET NULL,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
);

-- Table: favorite_jobs
CREATE TABLE favorite_jobs (
    job_publication_id INT,
    student_id INT,
    PRIMARY KEY (job_publication_id, student_id),
    FOREIGN KEY (job_publication_id) REFERENCES job_publication(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);

-- Table: verification
CREATE TABLE verification (
    id SERIAL PRIMARY KEY,
    verification_code VARCHAR(36) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Table: tag
CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table: job_tag
CREATE TABLE job_tag (
    job_id INT,
    tag_id INT,
    PRIMARY KEY (job_id, tag_id),
    FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);

-- Table: student_proficiency
CREATE TABLE student_proficiency (
    student_id INT,
    tag_id INT,
    PRIMARY KEY (student_id, tag_id),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);


--Default data for demo

-- Insert default users
INSERT INTO "user" (email, password, status, type)
VALUES 
('manu@gec.inatel.br', 'password_hash', 'complete', 'student'),
('juli@ges.inatel.br', 'password_hash', 'complete', 'student'),
('inatel@college.com', 'password_hash', 'complete', 'college'),
('techcorp@company.com', 'password_hash', 'complete', 'company');

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

-- Insert default services
INSERT INTO service (name, description, price, college_id, student_id)
VALUES 
('Aula de cálculo particular', 'Service 1 description', 100.00, (SELECT id FROM college WHERE company_id = (SELECT id FROM company WHERE name = 'Inatel')), (SELECT id FROM student WHERE first_name = 'Manuela')),
('Aula de física particular', 'Service 2 description', 200.00, (SELECT id FROM college WHERE company_id = (SELECT id FROM company WHERE name = 'Inatel')), (SELECT id FROM student WHERE first_name = 'Matheus'));

-- Insert default fields
INSERT INTO field (field)
VALUES 
('it'),
('engineering'),
('exact_sciences'),
('humanities'),
('business'),
('health'),
('arts'),
('agriculture'),
('law'),
('education');

-- Insert default jobs
INSERT INTO job (job_name, description, location, type, weekly_hours, mode, benefits, salary, requirements, field_id, company_id)
VALUES 
('Software Developer Intern', 'Develop software', 'Santa Rita do Sapucaí', 'clt', 40, 'remote', 'Health insurance', 3000.00, '1 year experience', (SELECT id FROM field WHERE field = 'it'), (SELECT id FROM company WHERE name = 'TechCorp')),
('Software Developer', 'Develop software', 'Santa Rita do Sapucaí', 'clt', 40, 'remote', 'Health insurance', 5000.00, '3 years experience', (SELECT id FROM field WHERE field = 'it'), (SELECT id FROM company WHERE name = 'TechCorp'));
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
('UX/UI'),
('Product Management'),
('Project Management'),
('Business Analysis'),
('Requirements Analysis'),
('Software Architecture'),
('Software Design'),
('Software Development'),
('Software Testing'),
('Software Maintenance'),
('Software Support'),
('Software Documentation'),
('Software Training'),
('Software Deployment'),
('Software Monitoring'),
('Software Optimization'),
('Software Migration'),
('Software Integration'),
('Software Security'),
('Software Compliance'),
('Software Governance'),
('Software Auditing'),
('Software Consulting'),
('Software Outsourcing'),
('Software Licensing'),
('Software Sales'),
('Software Marketing'),
('Software Distribution'),
('Software Development Kit'),
('Software Framework'),
('Software Library'),
('Software Repository'),
('Software Registry'),
('Software Repository Management'),
('Software Versioning'),
('Software Configuration Management'),
('Software Build Automation'),
('Software Release Automation'),
('Software Deployment Automation'),
('Software Testing Automation'),
('Software Monitoring Automation'),
('Software Optimization Automation'),
('Software Migration Automation'),
('Software Integration Automation'),
('Software Security Automation'),
('Software Compliance Automation'),
('Software Governance Automation'),
('Software Auditing Automation'),
('Software Consulting Automation'),
('Software Outsourcing Automation'),
('Software Licensing Automation'),
('Software Sales Automation'),
('Software Marketing Automation'),
('Software Distribution Automation'),
('Software Development Kit Automation'),
('Software Framework Automation'),
('Software Library Automation'),
('Software Repository Automation'),
('Software Registry Automation'),
('Software Repository Management Automation'),
('Software Versioning Automation'),
('Software Configuration Management Automation'),
('Software Build Automation Automation'),
('Software Release Automation Automation'),
('Software Deployment Automation Automation'),
('Software Testing Automation')

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

