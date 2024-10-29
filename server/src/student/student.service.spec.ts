/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { Experience } from '../entities/experience.entity';
import { StudentProficiency } from '../entities/student-proficiency.entity';
import { ValidEmail } from '../entities/valid-email.entity';
import { User } from '../entities/user.entity';
import { FavoriteJobs } from '../entities/favorite-jobs.entity';
import { JobPublication } from '../entities/job-publication.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/request-with-user.interface';

describe('StudentService', () => {
  let service: StudentService;
  let studentRepository: Repository<Student>;
  let experienceRepository: Repository<Experience>;
  let studentProficiencyRepository: Repository<StudentProficiency>;
  let validEmailRepository: Repository<ValidEmail>;
  let userRepository: Repository<User>;
  let jobPublicationRepository: Repository<JobPublication>;
  let favoriteJobsRepository: Repository<FavoriteJobs>;

  const mockStudentRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockExperienceRepository = {
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockStudentProficiencyRepository = {
    find: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockValidEmailRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockJobPublicationRepository = {
    findOne: jest.fn(),
  };

  const mockFavoriteJobsRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: 1,
      type: 'student',
      email: 'student@example.com',
    },
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockStudentRepository,
        },
        {
          provide: getRepositoryToken(Experience),
          useValue: mockExperienceRepository,
        },
        {
          provide: getRepositoryToken(StudentProficiency),
          useValue: mockStudentProficiencyRepository,
        },
        {
          provide: getRepositoryToken(ValidEmail),
          useValue: mockValidEmailRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(JobPublication),
          useValue: mockJobPublicationRepository,
        },
        {
          provide: getRepositoryToken(FavoriteJobs),
          useValue: mockFavoriteJobsRepository,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
    experienceRepository = module.get<Repository<Experience>>(
      getRepositoryToken(Experience),
    );
    studentProficiencyRepository = module.get<Repository<StudentProficiency>>(
      getRepositoryToken(StudentProficiency),
    );
    validEmailRepository = module.get<Repository<ValidEmail>>(
      getRepositoryToken(ValidEmail),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jobPublicationRepository = module.get<Repository<JobPublication>>(
      getRepositoryToken(JobPublication),
    );
    favoriteJobsRepository = module.get<Repository<FavoriteJobs>>(
      getRepositoryToken(FavoriteJobs),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfileByUser', () => {
    it('should return a student profile', async () => {
      const studentProfile = {
        id: 1,
        user: { id: 1, email: 'student@example.com' },
        college: { id: 1 },
        experiences: [],
        proficiencies: [],
      };
      mockStudentRepository.findOne.mockResolvedValue(studentProfile);

      const result = await service.getProfileByUser(mockRequest);
      expect(result).toEqual(studentProfile);
      expect(mockStudentRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockRequest.user.userId } },
        relations: ['user', 'college', 'experiences', 'proficiencies'],
      });
    });

    it('should throw NotFoundException if profile not found', async () => {
      mockStudentRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfileByUser(mockRequest)).rejects.toThrow(
        new NotFoundException('Perfil de estudante não encontrado.'),
      );
    });
  });

  describe('createProfile', () => {
    it('should create a student profile', async () => {
      const createStudentProfileDto = {
        student: {
          first_name: 'John',
          last_name: 'Doe',
          cpf: '12345678901',
        },
        experiences: [],
        proficiencies: [],
      };

      const user = { id: 1, email: 'student@example.com', type: 'student' };
      const newStudentProfile = {
        id: 1,
        ...createStudentProfileDto.student,
        user,
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockStudentRepository.save.mockResolvedValue(newStudentProfile);

      const result = await service.createProfile(
        createStudentProfileDto,
        mockRequest,
      );
      expect(result).toEqual(newStudentProfile);
      expect(mockStudentRepository.save).toHaveBeenCalledWith({
        ...createStudentProfileDto.student,
        user,
        college: { id: expect.any(Number) },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createProfile(
          {
            student: {
              first_name: 'John',
              last_name: 'Doe',
              cpf: '12345678901',
            },
            experiences: [],
            proficiencies: [],
          },
          mockRequest,
        ),
      ).rejects.toThrow(new NotFoundException('Usuário não encontrado.'));
    });

    it('should throw UnauthorizedException if user is not a student', async () => {
      const user = { id: 1, email: 'student@example.com', type: 'company' };
      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(
        service.createProfile(
          {
            student: {
              first_name: 'John',
              last_name: 'Doe',
              cpf: '12345678901',
            },
            experiences: [],
            proficiencies: [],
          },
          mockRequest,
        ),
      ).rejects.toThrow(
        new UnauthorizedException(
          'Apenas usuários do tipo estudante podem criar perfis de estudante.',
        ),
      );
    });
  });
});
