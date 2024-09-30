CREATE DATABASE IF NOT EXISTS unijobs;
USE unijobs;

-- Table: user
CREATE TABLE user (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('created', 'confirmed', 'complete') NOT NULL,
    type ENUM('student', 'college', 'company') NOT NULL
);

-- Table: student
CREATE TABLE student (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    user_id INT UNSIGNED,
    college_id INT UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES college(id) ON DELETE SET NULL
);

-- Table: experience
CREATE TABLE experience (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type ENUM('professional', 'academic') NOT NULL,
    description TEXT NOT NULL,
    student_id INT UNSIGNED,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);

-- Table: company
CREATE TABLE company (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    field_of_activity VARCHAR(100) NOT NULL,
    contact_website VARCHAR(255),
    user_id INT UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Table: college
CREATE TABLE college (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id INT UNSIGNED,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
);

-- Table: valid_email
CREATE TABLE valid_email (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    college_id INT UNSIGNED,
    FOREIGN KEY (college_id) REFERENCES college(id) ON DELETE CASCADE
);

-- Table: field
CREATE TABLE field (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    field ENUM('it', 'engineering', 'exact_sciences', 'humanities', 'business', 'health', 'arts', 'agriculture', 'law', 'education') NOT NULL
);

-- Table: course
CREATE TABLE course (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    field_id INT UNSIGNED,
    name VARCHAR(100) NOT NULL,
    college_id INT UNSIGNED,
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES college(id) ON DELETE CASCADE
);

-- Table: job
CREATE TABLE job (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    type ENUM('freelance', 'trainee', 'clt', 'pj', 'internship') NOT NULL,
    weekly_hours INT NOT NULL,
    mode ENUM('on_site', 'hybrid', 'remote') NOT NULL,
    benefits TEXT,
    salary INT UNSIGNED,
    requirements TEXT NOT NULL,
    field_id INT UNSIGNED,
    company_id INT UNSIGNED,
    FOREIGN KEY (field_id) REFERENCES field(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
);

-- Table: service
CREATE TABLE service (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    college_id INT UNSIGNED,
    student_id INT UNSIGNED,
    FOREIGN KEY (college_id) REFERENCES college(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);

-- Table: job_publication
CREATE TABLE job_publication (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id INT UNSIGNED,
    college_id INT UNSIGNED,
    company_id INT UNSIGNED,
    status ENUM('pending', 'approved', 'reproved', 'removed') DEFAULT 'pending',
    publication_request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    publication_date TIMESTAMP NULL,
    FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES college(id) ON DELETE SET NULL,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
);

-- Table: favorite_jobs
CREATE TABLE favorite_jobs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id INT UNSIGNED,
    student_id INT UNSIGNED,
    FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);

-- Table: verification
CREATE TABLE verification (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    verificationCode VARCHAR(36) NOT NULL,
    user_id INT UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Table: tag
CREATE TABLE tag (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table: job_tag
CREATE TABLE job_tag (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id INT UNSIGNED,
    tag_id INT UNSIGNED,
    FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);

-- Table: student_proficiency
CREATE TABLE student_proficiency (
    student_id INT UNSIGNED,
    tag_id INT UNSIGNED,
    PRIMARY KEY (student_id, tag_id),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);
