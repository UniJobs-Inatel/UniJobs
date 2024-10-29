import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobPublicationDto } from './dto/create-job-publication.dto';
import { UpdateJobPublicationDto } from './dto/update-job-publication.dto';
import { RequestWithUser } from '../auth/request-with-user.interface';

describe('JobController', () => {
  let controller: JobController;
  let service: JobService;

  const mockJobService = {
    createJob: jest.fn(),
    getAllJobs: jest.fn(),
    getJobById: jest.fn(),
    updateJob: jest.fn(),
    deleteJob: jest.fn(),
    createJobPublication: jest.fn(),
    getJobsByCompany: jest.fn(),
    getJobPublicationsByCompany: jest.fn(),
    getJobPublicationsByCollege: jest.fn(),
    updateJobPublication: jest.fn(),
  };

  const mockRequest = {
    user: { userId: 1, type: 'company' },
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        {
          provide: JobService,
          useValue: mockJobService,
        },
      ],
    }).compile();

    controller = module.get<JobController>(JobController);
    service = module.get<JobService>(JobService);

    jest.clearAllMocks(); // Clear mock calls before each test for isolated testing.
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createJob', () => {
    it('should create a job', async () => {
      const createJobDto: CreateJobDto = {
        job_name: 'Software Developer',
        description: 'Develop software solutions',
        location: 'Remote',
        type: 'clt',
        weekly_hours: 40,
        mode: 'remote',
        salary: 5000,
        requirements: 'Experience in Node.js and React',
        field_id: 1,
        company_id: 1,
      };

      const result = { id: 1, ...createJobDto };
      mockJobService.createJob.mockResolvedValue(result);

      expect(await controller.createJob(createJobDto, mockRequest)).toEqual(
        result,
      );
      expect(service.createJob).toHaveBeenCalledWith(createJobDto, mockRequest);
    });
  });

  describe('getAllJobs', () => {
    it('should return an array of jobs', async () => {
      const jobs = [{ id: 1, job_name: 'Software Developer' }];
      mockJobService.getAllJobs.mockResolvedValue(jobs);

      expect(await controller.getAllJobs()).toEqual(jobs);
      expect(service.getAllJobs).toHaveBeenCalled();
    });
  });

  describe('getJobById', () => {
    it('should return a job by ID', async () => {
      const job = { id: 1, job_name: 'Software Developer' };
      mockJobService.getJobById.mockResolvedValue(job);

      expect(await controller.getJobById(1)).toEqual(job);
      expect(service.getJobById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateJob', () => {
    it('should update a job', async () => {
      const updateJobDto: UpdateJobDto = {
        job_name: 'Senior Software Developer',
      };
      const result = { id: 1, ...updateJobDto };

      mockJobService.updateJob.mockResolvedValue(result);

      expect(await controller.updateJob(1, updateJobDto, mockRequest)).toEqual(
        result,
      );
      expect(service.updateJob).toHaveBeenCalledWith(
        1,
        updateJobDto,
        mockRequest,
      );
    });
  });

  describe('deleteJob', () => {
    it('should delete a job', async () => {
      mockJobService.deleteJob.mockResolvedValue(undefined);

      await controller.deleteJob(1, mockRequest);
      expect(service.deleteJob).toHaveBeenCalledWith(1, mockRequest);
    });
  });

  describe('publishJob', () => {
    it('should create a job publication', async () => {
      const createJobPublicationDto: CreateJobPublicationDto = {
        job_id: 1,
        company_id: 1,
      };
      const result = { id: 1, ...createJobPublicationDto };

      mockJobService.createJobPublication.mockResolvedValue(result);

      expect(
        await controller.publishJob(createJobPublicationDto, mockRequest),
      ).toEqual(result);
      expect(service.createJobPublication).toHaveBeenCalledWith(
        createJobPublicationDto,
        mockRequest,
      );
    });
  });

  describe('getJobsByCompany', () => {
    it("should return jobs by the requesting user's company", async () => {
      const jobs = [{ id: 1, job_name: 'Software Developer' }];
      mockJobService.getJobsByCompany.mockResolvedValue(jobs);

      expect(await controller.getJobsByCompany(mockRequest)).toEqual(jobs);
      expect(service.getJobsByCompany).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('getJobPublicationsByCompany', () => {
    it("should return job publications by the requesting user's company", async () => {
      const publications = [{ id: 1, job_id: 1, company_id: 1 }];
      mockJobService.getJobPublicationsByCompany.mockResolvedValue(
        publications,
      );

      expect(await controller.getJobPublicationsByCompany(mockRequest)).toEqual(
        publications,
      );
      expect(service.getJobPublicationsByCompany).toHaveBeenCalledWith(
        mockRequest,
      );
    });
  });

  describe('getJobPublicationsByCollege', () => {
    it("should return job publications by the requesting user's college", async () => {
      const publications = [{ id: 1, job_id: 1, college_id: 1 }];
      mockJobService.getJobPublicationsByCollege.mockResolvedValue(
        publications,
      );

      expect(await controller.getJobPublicationsByCollege(mockRequest)).toEqual(
        publications,
      );
      expect(service.getJobPublicationsByCollege).toHaveBeenCalledWith(
        mockRequest,
      );
    });
  });

  describe('updateJobPublication', () => {
    it('should update a job publication', async () => {
      const updateJobPublicationDto: UpdateJobPublicationDto = {
        status: 'approved',
      };
      const result = { id: 1, ...updateJobPublicationDto };

      mockJobService.updateJobPublication.mockResolvedValue(result);

      expect(
        await controller.updateJobPublication(
          1,
          updateJobPublicationDto,
          mockRequest,
        ),
      ).toEqual(result);
      expect(service.updateJobPublication).toHaveBeenCalledWith(
        1,
        updateJobPublicationDto,
        mockRequest,
      );
    });
  });
});
