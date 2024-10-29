/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JobPublication } from '../entities/job-publication.entity';
import { JobTag } from '../entities/job-tag.entity';
import { Company } from '../entities/company.entity';
import { College } from '../entities/college.entity';
import { Field } from '../entities/field.entity';
import { Student } from '../entities/student.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from '../auth/request-with-user.interface';

describe('JobService', () => {
  let service: JobService;
  let jobRepository: Repository<Job>;
  let jobPublicationRepository: Repository<JobPublication>;
  let jobTagRepository: Repository<JobTag>;
  let companyRepository: Repository<Company>;
  let collegeRepository: Repository<College>;
  let fieldRepository: Repository<Field>;
  let studentRepository: Repository<Student>;

  const mockJobRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    delete: jest.fn(),
  };

  const mockJobPublicationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockJobTagRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockCompanyRepository = {
    findOne: jest.fn(),
  };

  const mockCollegeRepository = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockFieldRepository = {
    findOne: jest.fn(),
  };

  const mockStudentRepository = {
    findOne: jest.fn(),
  };

  const mockRequest = {
    user: { userId: 1, type: 'company' },
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: getRepositoryToken(Job),
          useValue: mockJobRepository,
        },
        {
          provide: getRepositoryToken(JobTag),
          useValue: mockJobTagRepository,
        },
        {
          provide: getRepositoryToken(JobPublication),
          useValue: mockJobPublicationRepository,
        },
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
        {
          provide: getRepositoryToken(College),
          useValue: mockCollegeRepository,
        },
        {
          provide: getRepositoryToken(Field),
          useValue: mockFieldRepository,
        },
        {
          provide: getRepositoryToken(Student),
          useValue: mockStudentRepository,
        },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
    jobRepository = module.get<Repository<Job>>(getRepositoryToken(Job));
    jobPublicationRepository = module.get<Repository<JobPublication>>(
      getRepositoryToken(JobPublication),
    );
    jobTagRepository = module.get<Repository<JobTag>>(
      getRepositoryToken(JobTag),
    );
    companyRepository = module.get<Repository<Company>>(
      getRepositoryToken(Company),
    );
    collegeRepository = module.get<Repository<College>>(
      getRepositoryToken(College),
    );
    fieldRepository = module.get<Repository<Field>>(getRepositoryToken(Field));
    studentRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createJob', () => {
    it('should create a job', async () => {
      const createJobDto: CreateJobDto = {
        job_name: 'Software Engineer',
        description: 'Develops software',
        location: 'Remote',
        type: 'clt',
        weekly_hours: 40,
        mode: 'remote',
        salary: 5000,
        requirements: 'Experience with Node.js',
        field_id: 1,
        company_id: 1,
      };
      const company = { id: 1, user: { id: 1 } };
      const field = { id: 1, field: 'it' };
      const job = { id: 1, ...createJobDto, company, field };

      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockFieldRepository.findOne.mockResolvedValue(field);
      mockJobRepository.create.mockReturnValue(job);
      mockJobRepository.save.mockResolvedValue(job);

      const result = await service.createJob(createJobDto, mockRequest);

      expect(result).toEqual(job);
      expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
        where: { id: createJobDto.company_id },
        relations: ['user'],
      });
      expect(mockFieldRepository.findOne).toHaveBeenCalledWith({
        where: { id: createJobDto.field_id },
      });
      expect(mockJobRepository.save).toHaveBeenCalledWith(job);
    });

    it('should throw NotFoundException if company is not found', async () => {
      mockCompanyRepository.findOne.mockResolvedValue(null);

      const createJobDto: CreateJobDto = {
        job_name: 'Software Engineer',
        description: 'Develops software',
        location: 'Remote',
        type: 'clt',
        weekly_hours: 40,
        mode: 'remote',
        salary: 5000,
        requirements: 'Experience with Node.js',
        field_id: 1,
        company_id: 1,
      };
      const company = { id: 1, user: { id: 1 } };
      const field = { id: 1, field: 'it' };
      const job = { id: 1, ...createJobDto, company, field };

      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockFieldRepository.findOne.mockResolvedValue(field);
      mockJobRepository.create.mockReturnValue(job);
      mockJobRepository.save.mockResolvedValue(job);

      await expect(
        service.createJob({ ...createJobDto, company_id: 2 }, mockRequest),
      ).rejects.toThrow(new NotFoundException('Empresa não encontrada.'));
    });

    it('should throw UnauthorizedException if user is not authorized', async () => {
      const company = { id: 1, user: { id: 2 } };
      mockCompanyRepository.findOne.mockResolvedValue(company);

      const createJobDto: CreateJobDto = {
        job_name: 'Software Engineer',
        description: 'Develops software',
        location: 'Remote',
        type: 'clt',
        weekly_hours: 40,
        mode: 'remote',
        salary: 5000,
        requirements: 'Experience with Node.js',
        field_id: 1,
        company_id: 1,
      };
      const field = { id: 1, field: 'it' };
      const job = { id: 1, ...createJobDto, company, field };

      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockFieldRepository.findOne.mockResolvedValue(field);
      mockJobRepository.create.mockReturnValue(job);
      mockJobRepository.save.mockResolvedValue(job);

      await expect(
        service.createJob(createJobDto, mockRequest),
      ).rejects.toThrow(
        new UnauthorizedException(
          'Usuário não autorizado a criar uma vaga para esta empresa.',
        ),
      );
    });

    it('should throw NotFoundException if field is not found', async () => {
      const company = { id: 1, user: { id: 1 } };
      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockFieldRepository.findOne.mockResolvedValue(null);

      const createJobDto: CreateJobDto = {
        job_name: 'Software Engineer',
        description: 'Develops software',
        location: 'Remote',
        type: 'clt',
        weekly_hours: 40,
        mode: 'remote',
        salary: 5000,
        requirements: 'Experience with Node.js',
        field_id: 1,
        company_id: 1,
      };
      const field = { id: 1, field: 'it' };
      const job = { id: 1, ...createJobDto, company, field };

      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockFieldRepository.findOne.mockResolvedValue(field);
      mockJobRepository.create.mockReturnValue(job);
      mockJobRepository.save.mockResolvedValue(job);

      await expect(
        service.createJob(createJobDto, mockRequest),
      ).rejects.toThrow(
        new NotFoundException('Área de atuação não encontrada.'),
      );
    });
  });

  describe('getAllJobs', () => {
    it('should return an array of jobs', async () => {
      const jobs = [{ id: 1, job_name: 'Software Engineer' }];
      mockJobRepository.find.mockResolvedValue(jobs);

      expect(await service.getAllJobs()).toEqual(jobs);
      expect(mockJobRepository.find).toHaveBeenCalled();
    });
  });

  describe('getJobById', () => {
    it('should return a job by ID', async () => {
      const job = { id: 1, job_name: 'Software Engineer' };
      mockJobRepository.findOne.mockResolvedValue(job);

      expect(await service.getJobById(1)).toEqual(job);
      expect(mockJobRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['field', 'company'],
      });
    });

    it('should throw NotFoundException if job is not found', async () => {
      mockJobRepository.findOne.mockResolvedValue(null);

      await expect(service.getJobById(999)).rejects.toThrow(
        new NotFoundException('Vaga não encontrada.'),
      );
    });
  });

  describe('updateJob', () => {
    it('should update a job', async () => {
      const updateJobDto: UpdateJobDto = {
        job_name: 'Senior Software Engineer',
      };
      const job = {
        id: 1,
        job_name: 'Software Engineer',
        company: { id: 1, user: { id: 1 } },
      };

      mockJobRepository.findOne.mockResolvedValue(job);
      mockJobRepository.save.mockResolvedValue({ ...job, ...updateJobDto });

      const result = await service.updateJob(1, updateJobDto, mockRequest);

      expect(result).toEqual({ ...job, ...updateJobDto });
      expect(mockJobRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['company'],
      });
      expect(mockJobRepository.save).toHaveBeenCalledWith({
        ...job,
        ...updateJobDto,
      });
    });

    it('should throw UnauthorizedException if user is not authorized', async () => {
      const job = {
        id: 1,
        job_name: 'Software Engineer',
        company: { id: 1, user: { id: 2 } },
      };
      mockJobRepository.findOne.mockResolvedValue(job);

      await expect(service.updateJob(1, {}, mockRequest)).rejects.toThrow(
        new UnauthorizedException(
          'Usuário não autorizado a atualizar esta vaga.',
        ),
      );
    });

    it('should throw NotFoundException if job is not found', async () => {
      mockJobRepository.findOne.mockResolvedValue(null);

      await expect(service.updateJob(999, {}, mockRequest)).rejects.toThrow(
        new NotFoundException('Vaga não encontrada.'),
      );
    });
  });

  describe('deleteJob', () => {
    it('should delete a job', async () => {
      const job = {
        id: 1,
        job_name: 'Software Engineer',
        company: { id: 1, user: { id: 1 } },
      };
      mockJobRepository.findOne.mockResolvedValue(job);
      mockJobRepository.delete.mockResolvedValue(undefined);

      await service.deleteJob(1, mockRequest);

      expect(mockJobRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['company'],
      });
      expect(mockJobRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException if user is not authorized', async () => {
      const job = {
        id: 1,
        job_name: 'Software Engineer',
        company: { id: 1, user: { id: 2 } },
      };
      mockJobRepository.findOne.mockResolvedValue(job);

      await expect(service.deleteJob(1, mockRequest)).rejects.toThrow(
        new UnauthorizedException(
          'Usuário não autorizado a deletar esta vaga.',
        ),
      );
    });

    it('should throw NotFoundException if job is not found', async () => {
      mockJobRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteJob(999, mockRequest)).rejects.toThrow(
        new NotFoundException('Vaga não encontrada.'),
      );
    });
  });
});
