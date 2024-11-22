import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { RequestWithUser } from '../auth/request-with-user.interface';

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;

  const mockStudentService = {
    createProfile: jest.fn(),
    updateProfile: jest.fn(),
    getProfileByUser: jest.fn(),
    createExperience: jest.fn(),
    getAllExperiences: jest.fn(),
    getExperienceById: jest.fn(),
    updateExperience: jest.fn(),
    deleteExperience: jest.fn(),
    getFavoriteJobs: jest.fn(),
    favoriteJob: jest.fn(),
    unfavoriteJob: jest.fn(),
  };

  const mockRequest = {
    user: { userId: 1, type: 'student' },
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProfile', () => {
    it('should create a student profile', async () => {
      const createStudentProfileDto: CreateStudentProfileDto = {
        student: {
          first_name: 'John',
          last_name: 'Doe',
          cpf: '12345678901',
        },
        experiences: [],
        proficiencies: [],
      };

      const result = { message: 'Profile created successfully' };
      mockStudentService.createProfile.mockResolvedValue(result);

      expect(
        await controller.createProfile(createStudentProfileDto, mockRequest),
      ).toEqual(result);
      expect(service.createProfile).toHaveBeenCalledWith(
        createStudentProfileDto,
        mockRequest,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update a student profile', async () => {
      const updateStudentProfileDto: UpdateStudentProfileDto = {
        student: {
          first_name: 'Jane',
          last_name: 'Doe',
          cpf: '09876543210',
        },
        experiences: [],
        proficiencies: [],
      };

      const result = { message: 'Profile updated successfully' };
      mockStudentService.updateProfile.mockResolvedValue(result);

      expect(
        await controller.updateProfile(updateStudentProfileDto, mockRequest),
      ).toEqual(result);
      expect(service.updateProfile).toHaveBeenCalledWith(
        updateStudentProfileDto,
        mockRequest,
      );
    });
  });

  describe('getProfileByUser', () => {
    it('should return a student profile by user', async () => {
      const result = {
        first_name: 'John',
        last_name: 'Doe',
        cpf: '12345678901',
      };
      mockStudentService.getProfileByUser.mockResolvedValue(result);

      expect(await controller.getProfileByUser(mockRequest)).toEqual(result);
      expect(service.getProfileByUser).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('createExperience', () => {
    it('should create an experience', async () => {
      const createExperienceDto: CreateExperienceDto = {
        studentId: 1,
        type: 'professional',
        description: 'Software development',
        company_name: 'Company A',
        position: 'Developer',
        start_date: new Date('2023-01-01'),
        end_date: null,
      };

      const result = { message: 'Experience created successfully' };
      mockStudentService.createExperience.mockResolvedValue(result);

      expect(await controller.createExperience(createExperienceDto)).toEqual(
        result,
      );
      expect(service.createExperience).toHaveBeenCalledWith(
        createExperienceDto,
      );
    });
  });

  describe('updateExperience', () => {
    it('should update an experience', async () => {
      const updateExperienceDto: UpdateExperienceDto = {
        description: 'Updated experience description',
      };

      const result = { message: 'Experience updated successfully' };
      mockStudentService.updateExperience.mockResolvedValue(result);

      expect(await controller.updateExperience(1, updateExperienceDto)).toEqual(
        result,
      );
      expect(service.updateExperience).toHaveBeenCalledWith(
        1,
        updateExperienceDto,
      );
    });
  });

  describe('deleteExperience', () => {
    it('should delete an experience', async () => {
      mockStudentService.deleteExperience.mockResolvedValue(undefined);

      await controller.deleteExperience(1);

      expect(service.deleteExperience).toHaveBeenCalledWith(1);
    });
  });

  describe('getFavoriteJobs', () => {
    it("should get a student's favorite jobs", async () => {
      const result = [{ id: 1, jobName: 'Software Engineer' }];
      mockStudentService.getFavoriteJobs.mockResolvedValue(result);

      expect(await controller.getFavoriteJobs(mockRequest)).toEqual(result);
      expect(service.getFavoriteJobs).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('favoriteJob', () => {
    it('should add a job to favorites', async () => {
      const jobId = 1;
      const result = { message: 'Job added to favorites' };
      mockStudentService.favoriteJob.mockResolvedValue(result);

      expect(await controller.favoriteJob(jobId, mockRequest)).toEqual(result);
      expect(service.favoriteJob).toHaveBeenCalledWith(jobId, mockRequest);
    });
  });

  describe('unfavoriteJob', () => {
    it('should remove a job from favorites', async () => {
      const jobId = 1;
      mockStudentService.unfavoriteJob.mockResolvedValue(undefined);

      await controller.unfavoriteJob(jobId, mockRequest);

      expect(service.unfavoriteJob).toHaveBeenCalledWith(jobId, mockRequest);
    });
  });
});
