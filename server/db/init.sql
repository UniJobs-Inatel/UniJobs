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