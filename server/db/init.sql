CREATE DATABASE IF NOT EXISTS tcc;
USE tcc;

-- Table: usuario
CREATE TABLE usuario (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    status ENUM('created', 'confirmed', 'complete') NOT NULL,
    type ENUM('aluno', 'faculdade', 'empresa') NOT NULL
);

-- Table: aluno
CREATE TABLE aluno (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    usuario_id INT UNSIGNED,
    faculdade_id INT UNSIGNED,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (faculdade_id) REFERENCES faculdade(id) ON DELETE SET NULL
);

-- Table: experiencia
CREATE TABLE experiencia (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('profissional', 'academica') NOT NULL,
    descricao TEXT NOT NULL,
    aluno_id INT UNSIGNED,
    FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE
);

-- Table: empresa
CREATE TABLE empresa (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    area_atuacao VARCHAR(100) NOT NULL,
    site_contato VARCHAR(255),
    usuario_id INT UNSIGNED,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Table: faculdade
CREATE TABLE faculdade (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Table: emailValido
CREATE TABLE emailValido (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    final VARCHAR(100) NOT NULL,
    faculdade_id INT UNSIGNED,
    FOREIGN KEY (faculdade_id) REFERENCES faculdade(id) ON DELETE CASCADE
);

-- Table: area
CREATE TABLE area (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    area ENUM('ti', 'engenharias', 'exatas', 'humanas', 'business', 'saude', 'artes', 'agraria', 'direito', 'educacao') NOT NULL
);

-- Table: cursos
CREATE TABLE cursos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    area_id INT UNSIGNED,
    nome VARCHAR(100) NOT NULL,
    faculdade_id INT UNSIGNED,
    FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE,
    FOREIGN KEY (faculdade_id) REFERENCES faculdade(id) ON DELETE CASCADE
);

-- Table: vaga
CREATE TABLE vaga (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome_da_vaga VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    local VARCHAR(100) NOT NULL,
    tipo ENUM('freelance', 'trainee', 'clt', 'pj', 'estagio') NOT NULL,
    horas_semanais INT NOT NULL,
    modalidade ENUM('presencial', 'hibrido', 'homeoffice') NOT NULL,
    beneficios TEXT,
    faixa_salarial VARCHAR(100),
    requisitos TEXT NOT NULL,
    area_id INT UNSIGNED,
    FOREIGN KEY (area_id) REFERENCES area(id) ON DELETE CASCADE
);

-- Table: servico
CREATE TABLE servico (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    faculdade_id INT UNSIGNED,
    aluno_id INT UNSIGNED,
    FOREIGN KEY (faculdade_id) REFERENCES faculdade(id) ON DELETE SET NULL,
    FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE
);

-- Table: publicacaoDeVaga
CREATE TABLE publicacaoDeVaga (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vaga_id INT UNSIGNED,
    faculdade_id INT UNSIGNED,
    empresa_id INT UNSIGNED,
    FOREIGN KEY (vaga_id) REFERENCES vaga(id) ON DELETE CASCADE,
    FOREIGN KEY (faculdade_id) REFERENCES faculdade(id) ON DELETE SET NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
);

-- Table: vagasFavoritas
CREATE TABLE vagasFavoritas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vaga_id INT UNSIGNED,
    aluno_id INT UNSIGNED,
    FOREIGN KEY (vaga_id) REFERENCES vaga(id) ON DELETE CASCADE,
    FOREIGN KEY (aluno_id) REFERENCES aluno(id) ON DELETE CASCADE
);
