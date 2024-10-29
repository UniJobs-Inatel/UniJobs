/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CollegeService } from './college.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { College } from '../entities/college.entity';
import { ValidEmail } from '../entities/valid-email.entity';
import { Company } from '../entities/company.entity';
import { Repository } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCollegeDto } from './dto/create-college-dto';
import { CreateValidEmailDto } from './dto/create-valid-email-dto';
import { RequestWithUser } from 'src/auth/request-with-user.interface';

describe('CollegeService', () => {
  let service: CollegeService;
  let collegeRepository: Repository<College>;
  let validEmailRepository: Repository<ValidEmail>;
  let companyRepository: Repository<Company>;

  const mockCollegeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockValidEmailRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockCompanyRepository = {
    findOne: jest.fn(),
  };

  const mockRequest = {
    user: { userId: 1, type: 'college' },
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollegeService,
        {
          provide: getRepositoryToken(College),
          useValue: mockCollegeRepository,
        },
        {
          provide: getRepositoryToken(ValidEmail),
          useValue: mockValidEmailRepository,
        },
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<CollegeService>(CollegeService);
    collegeRepository = module.get<Repository<College>>(
      getRepositoryToken(College),
    );
    validEmailRepository = module.get<Repository<ValidEmail>>(
      getRepositoryToken(ValidEmail),
    );
    companyRepository = module.get<Repository<Company>>(
      getRepositoryToken(Company),
    );

    jest.clearAllMocks(); // Clear mocks before each test to ensure clean state.
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCollege', () => {
    it('should create a college', async () => {
      const createCollegeDto: CreateCollegeDto = { company_id: 1 };
      const company = { id: 1, user: { id: 1, type: 'college' } };

      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockCollegeRepository.create.mockReturnValue({ company });
      mockCollegeRepository.save.mockResolvedValue({ id: 1, company });

      const result = await service.createCollege(createCollegeDto, mockRequest);

      expect(result).toEqual({ id: 1, company });
      expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
        where: { id: createCollegeDto.company_id },
        relations: ['user'],
      });
      expect(mockCollegeRepository.save).toHaveBeenCalledWith({ company });
    });

    it('should throw NotFoundException if company is not found', async () => {
      mockCompanyRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createCollege({ company_id: 999 }, mockRequest),
      ).rejects.toThrow(new NotFoundException('Empresa não encontrada.'));
    });

    it('should throw UnauthorizedException if user is not authorized', async () => {
      const company = { id: 1, user: { id: 2, type: 'company' } };
      mockCompanyRepository.findOne.mockResolvedValue(company);

      await expect(
        service.createCollege({ company_id: 1 }, mockRequest),
      ).rejects.toThrow(
        new UnauthorizedException(
          'O usuário associado a esta empresa deve ser do tipo "faculdade".',
        ),
      );
    });
  });

  describe('createValidEmail', () => {
    it('should create a valid email', async () => {
      const createValidEmailDto: CreateValidEmailDto = {
        domain: 'test.com',
        college_id: 1,
      };
      const college = { id: 1, company: { id: 1, user: { id: 1 } } };
      const validEmail = { id: 1, domain: 'test.com', college };

      mockCollegeRepository.findOne.mockResolvedValue(college);
      mockValidEmailRepository.create.mockReturnValue(validEmail);
      mockValidEmailRepository.save.mockResolvedValue(validEmail);

      const result = await service.createValidEmail(
        createValidEmailDto,
        mockRequest,
      );

      expect(result).toEqual(validEmail);
      expect(mockCollegeRepository.findOne).toHaveBeenCalledWith({
        where: { id: createValidEmailDto.college_id },
        relations: ['company'],
      });
      expect(mockValidEmailRepository.save).toHaveBeenCalledWith(validEmail);
    });

    it('should throw NotFoundException if college is not found', async () => {
      mockCollegeRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createValidEmail(
          { domain: 'test.com', college_id: 999 },
          mockRequest,
        ),
      ).rejects.toThrow(new NotFoundException('Faculdade não encontrada.'));
    });

    it('should throw UnauthorizedException if user is not authorized', async () => {
      const college = { id: 1, company: { id: 1, user: { id: 2 } } };
      mockCollegeRepository.findOne.mockResolvedValue(college);

      await expect(
        service.createValidEmail(
          { domain: 'test.com', college_id: 1 },
          mockRequest,
        ),
      ).rejects.toThrow(
        new UnauthorizedException(
          'Usuário não autorizado a realizar esta ação.',
        ),
      );
    });
  });

  describe('deleteValidEmail', () => {
    it('should delete a valid email', async () => {
      const emailId = 1;
      const validEmail = {
        id: emailId,
        college: { company: { id: 1, user: { id: 1 } } },
      };

      mockValidEmailRepository.findOne.mockResolvedValue(validEmail);
      mockValidEmailRepository.delete.mockResolvedValue(undefined);

      await service.deleteValidEmail(emailId, mockRequest);

      expect(mockValidEmailRepository.delete).toHaveBeenCalledWith({
        id: emailId,
      });
    });

    it('should throw NotFoundException if valid email is not found', async () => {
      mockValidEmailRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteValidEmail(999, mockRequest)).rejects.toThrow(
        new NotFoundException('E-mail válido não encontrado.'),
      );
    });

    it('should throw UnauthorizedException if user is not authorized', async () => {
      const validEmail = {
        id: 1,
        college: { company: { id: 1, user: { id: 2 } } },
      };
      mockValidEmailRepository.findOne.mockResolvedValue(validEmail);

      await expect(service.deleteValidEmail(1, mockRequest)).rejects.toThrow(
        new UnauthorizedException(
          'Usuário não autorizado a realizar esta ação.',
        ),
      );
    });
  });

  describe('listValidEmails', () => {
    it('should list valid emails for a college', async () => {
      const collegeId = 1;
      const college = { id: collegeId, company: { id: 1, user: { id: 1 } } };
      const validEmails = [{ id: 1, domain: 'test.com' }];

      mockCollegeRepository.findOne.mockResolvedValue(college);
      mockValidEmailRepository.find.mockResolvedValue(validEmails);

      const result = await service.listValidEmails(collegeId, mockRequest);

      expect(result).toEqual(validEmails);
      expect(mockValidEmailRepository.find).toHaveBeenCalledWith({
        where: { college: { id: collegeId } },
      });
    });
  });

  describe('listAllValidEmails', () => {
    it('should list all valid emails', async () => {
      const colleges = [{ id: 1, company: { user: { id: 1 } } }];
      const validEmails = [{ id: 1, domain: 'test.com' }];

      mockCollegeRepository.find.mockResolvedValue(colleges);
      mockValidEmailRepository.find.mockResolvedValue(validEmails);

      const result = await service.listAllValidEmails(mockRequest);

      expect(result).toEqual(validEmails);
      expect(mockValidEmailRepository.find).toHaveBeenCalled();
    });
  });
});
