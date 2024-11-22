/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JobPublication } from '../entities/job-publication.entity';
import { JobTag } from '../entities/job-tag.entity';
import { Company } from '../entities/company.entity';
import { College } from '../entities/college.entity';
import { Field } from '../entities/field.entity';
import { Student } from '../entities/student.entity';
import { FavoriteJobs } from '../entities/favorite-jobs.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { CreateJobPublicationDto } from './dto/create-job-publication.dto';
import { UpdateJobPublicationDto } from './dto/update-job-publication.dto';

describe('JobService', () => {
  let service: JobService;
  let jobRepository: Repository<Job>;
  let jobPublicationRepository: Repository<JobPublication>;
  let jobTagRepository: Repository<JobTag>;
  let companyRepository: Repository<Company>;
  let collegeRepository: Repository<College>;
  let fieldRepository: Repository<Field>;
  let studentRepository: Repository<Student>;
  let favoriteJobsRepository: Repository<FavoriteJobs>;

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

  const mockCompanyRepository = {
    findOne: jest.fn(),
  };

  const mockCollegeRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockFieldRepository = {
    findOne: jest.fn(),
  };

  const mockStudentRepository = {
    findOne: jest.fn(),
  };

  const mockFavoriteJobsRepository = {
    find: jest.fn(),
  };

  const mockJobTagRepository = {
    create: jest.fn(),
    save: jest.fn(),
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
          provide: getRepositoryToken(JobPublication),
          useValue: mockJobPublicationRepository,
        },
        {
          provide: getRepositoryToken(JobTag),
          useValue: mockJobTagRepository,
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
        {
          provide: getRepositoryToken(FavoriteJobs),
          useValue: mockFavoriteJobsRepository,
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
    favoriteJobsRepository = module.get<Repository<FavoriteJobs>>(
      getRepositoryToken(FavoriteJobs),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createJob', () => {
    it('should create a job', async () => {
      const createJobDto: CreateJobDto = {
        job_name: 'Software Engineer',
        description: 'Develop software',
        location: 'Remote',
        type: 'clt',
        weekly_hours: 40,
        mode: 'remote',
        salary: 5000,
        requirements: 'Experience with Node.js',
        field_id: 1,
      };

      const company = { id: 1, user: { id: mockRequest.user.userId } };
      const field = { id: 1, field: 'IT' };
      const job = { id: 1, ...createJobDto, company, field };

      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockFieldRepository.findOne.mockResolvedValue(field);
      mockJobRepository.create.mockReturnValue(job);
      mockJobRepository.save.mockResolvedValue(job);

      const result = await service.createJob(createJobDto, mockRequest);

      expect(result).toEqual(job);
      expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockRequest.user.userId } },
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
        description: 'Develop software',
        location: 'Remote',
        type: 'clt',
        weekly_hours: 40,
        mode: 'remote',
        salary: 5000,
        requirements: 'Experience with Node.js',
        field_id: 1,
      };

      await expect(
        service.createJob(createJobDto, mockRequest),
      ).rejects.toThrow(new NotFoundException('Empresa não encontrada.'));
    });

    it('should throw NotFoundException if field is not found', async () => {
      const company = { id: 1, user: { id: mockRequest.user.userId } };
      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockFieldRepository.findOne.mockResolvedValue(null);

      const createJobDto: CreateJobDto = {
        job_name: 'Software Engineer',
        description: 'Develop software',
        location: 'Remote',
        type: 'clt',
        weekly_hours: 40,
        mode: 'remote',
        salary: 5000,
        requirements: 'Experience with Node.js',
        field_id: 1,
      };

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

      const result = await service.getJobById(1);

      expect(result).toEqual(job);
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

  describe('searchJobs', () => {
    it('should return filtered jobs with pagination', async () => {
      const filters = { location: 'Remote', type: 'clt' };
      const pagination = { limit: 10, offset: 0 };
      const jobs = [{ id: 1, job_name: 'Software Engineer' }];
      mockJobRepository.createQueryBuilder.mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([jobs, 1]),
      }));

      const result = await service.searchJobs(filters, pagination);

      expect(result).toEqual({
        jobs,
        total: 1,
        pageCount: 1,
        currentPage: 1,
      });
    });
  });

  describe('createJobPublication', () => {
    it('should create a job publication', async () => {
      const createJobPublicationDto: CreateJobPublicationDto = {
        job_id: 1,
        college_id: 2,
      };
      const company = { id: 1, user: { id: mockRequest.user.userId } };
      const job = { id: 1, company };
      const college = { id: 2 };

      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockJobRepository.findOne.mockResolvedValue(job);
      mockCollegeRepository.findOne.mockResolvedValue(college);
      mockJobPublicationRepository.create.mockReturnValue({
        job,
        company,
        college,
        status: 'pending',
      });
      mockJobPublicationRepository.save.mockResolvedValue({
        job,
        company,
        college,
        status: 'pending',
      });

      const result = await service.createJobPublication(
        createJobPublicationDto,
        mockRequest,
      );

      expect(result).toEqual({
        job,
        company,
        college,
        status: 'pending',
      });
    });

    it('should throw NotFoundException if job is not found', async () => {
      mockJobRepository.findOne.mockResolvedValue(null);

      const createJobPublicationDto: CreateJobPublicationDto = {
        job_id: 999,
        college_id: 1,
      };

      await expect(
        service.createJobPublication(createJobPublicationDto, mockRequest),
      ).rejects.toThrow(new NotFoundException('Vaga não encontrada.'));
    });

    it('should throw UnauthorizedException if job does not belong to company', async () => {
      const job = { id: 1, company: { id: 2 } };
      const company = { id: 1, user: { id: mockRequest.user.userId } };

      mockJobRepository.findOne.mockResolvedValue(job);
      mockCompanyRepository.findOne.mockResolvedValue(company);

      const createJobPublicationDto: CreateJobPublicationDto = {
        job_id: 1,
        college_id: 1,
      };

      await expect(
        service.createJobPublication(createJobPublicationDto, mockRequest),
      ).rejects.toThrow(
        new UnauthorizedException('Vaga não pertence a empresa informada.'),
      );
    });
  });

  describe('getCollegesWhereJobIsNotPublished', () => {
    it('should return colleges where the job is not published', async () => {
      const job = { id: 1 };
      const colleges = [{ id: 2 }, { id: 3 }];
      const publications = [{ college: { id: 1 } }];

      mockJobRepository.findOne.mockResolvedValue(job);
      mockJobPublicationRepository.find.mockResolvedValue(publications);
      mockCollegeRepository.find.mockResolvedValue(colleges);

      const result = await service.getCollegesWhereJobIsNotPublished(1);

      expect(result).toEqual(colleges);
      expect(mockCollegeRepository.find).toHaveBeenCalledWith({
        where: { id: Not(In([1])) },
        relations: ['company'],
      });
    });

    it('should throw NotFoundException if job is not found', async () => {
      mockJobRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getCollegesWhereJobIsNotPublished(999),
      ).rejects.toThrow(new NotFoundException('Vaga não encontrada.'));
    });
  });

  describe('updateJobPublication', () => {
    it('should update the status of a job publication', async () => {
      const jobPublication = {
        id: 1,
        status: 'pending',
        company: { id: 1 },
        college: { id: 2 },
      };
      const updateJobPublicationDto: UpdateJobPublicationDto = {
        status: 'approved',
      };
      const company = { id: 1, user: { id: mockRequest.user.userId } };
      const college = { id: 2, company };

      mockJobPublicationRepository.findOne.mockResolvedValue(jobPublication);
      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockCollegeRepository.findOne.mockResolvedValue(college);
      mockJobPublicationRepository.save.mockResolvedValue({
        ...jobPublication,
        status: 'approved',
        publication_date: new Date(),
      });

      const result = await service.updateJobPublication(
        1,
        updateJobPublicationDto,
        mockRequest,
      );

      expect(result.status).toBe('approved');
      expect(result.publication_date).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid status update', async () => {
      const jobPublication = {
        id: 1,
        status: 'pending',
        company: { id: 1 },
        college: { id: 2 },
      };
      const updateJobPublicationDto: UpdateJobPublicationDto = {
        status: 'removed',
      };
      const company = { id: 2, user: { id: mockRequest.user.userId } };
      const college = { id: 2, company };

      mockJobPublicationRepository.findOne.mockResolvedValue(jobPublication);
      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockCollegeRepository.findOne.mockResolvedValue(college);

      await expect(
        service.updateJobPublication(1, updateJobPublicationDto, mockRequest),
      ).rejects.toThrow(
        new UnauthorizedException(
          'Transição de status inválida de pending para removed.',
        ),
      );
    });

    describe('checkIfJobIsPublishedOnAllColleges', () => {
      it('should return true if the job is published in all colleges', async () => {
        const job = { id: 1 };
        const colleges = [{ id: 1 }, { id: 2 }];
        const publications = [
          { college: { id: 1 }, status: 'approved' },
          { college: { id: 2 }, status: 'approved' },
        ];

        mockJobRepository.findOne.mockResolvedValue(job);
        mockCollegeRepository.find.mockResolvedValue(colleges);
        mockJobPublicationRepository.find.mockResolvedValue(publications);

        const result = await service.checkIfJobIsPublishedOnAllColleges(1);

        expect(result).toBe(true);
      });

      it('should return false if any publication is removed or reproved', async () => {
        const job = { id: 1 };
        const colleges = [{ id: 1 }, { id: 2 }];
        const publications = [
          { college: { id: 1 }, status: 'approved' },
          { college: { id: 2 }, status: 'removed' },
        ];

        mockJobRepository.findOne.mockResolvedValue(job);
        mockCollegeRepository.find.mockResolvedValue(colleges);
        mockJobPublicationRepository.find.mockResolvedValue(publications);

        const result = await service.checkIfJobIsPublishedOnAllColleges(1);

        expect(result).toBe(false);
      });
    });
  });
});
