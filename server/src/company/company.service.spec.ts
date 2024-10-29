/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { User } from '../entities/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestWithUser } from '../auth/request-with-user.interface';

describe('CompanyService', () => {
  let service: CompanyService;
  let companyRepository: Repository<Company>;
  let userRepository: Repository<User>;

  const mockCompanyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockRequest = {
    user: { userId: 1, type: 'company' },
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    companyRepository = module.get<Repository<Company>>(
      getRepositoryToken(Company),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks(); // Reset mocks between tests for isolation.
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCompanyProfile', () => {
    it('should create a company profile', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        description: 'A test company',
        cnpj: '12345678000100',
        field_of_activity: 'IT Services',
        contact_website: 'https://testcompany.com',
        user_id: 1,
      };
      const user = { id: 1, type: 'company' };
      const company = { id: 1, ...createCompanyDto, user };

      mockCompanyRepository.findOne.mockResolvedValue(null); // No existing profile
      mockUserRepository.findOne.mockResolvedValue(user);
      mockCompanyRepository.create.mockReturnValue(company);
      mockCompanyRepository.save.mockResolvedValue(company);

      const result = await service.createCompanyProfile(
        createCompanyDto,
        mockRequest,
      );

      expect(result).toEqual(company);
      expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockRequest.user.userId } },
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockRequest.user.userId },
      });
      expect(mockCompanyRepository.save).toHaveBeenCalledWith(company);
    });

    it('should throw ConflictException if a profile already exists', async () => {
      mockCompanyRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(
        service.createCompanyProfile(
          {
            name: 'Test Company',
            description: 'A test company',
            cnpj: '12345678000100',
            field_of_activity: 'IT Services',
            user_id: 1,
          },
          mockRequest,
        ),
      ).rejects.toThrow(
        new ConflictException('O usuário já possui um perfil de empresa.'),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockCompanyRepository.findOne.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createCompanyProfile(
          {
            name: 'Test Company',
            description: 'A test company',
            cnpj: '12345678000100',
            field_of_activity: 'IT Services',
            user_id: 1,
          },
          mockRequest,
        ),
      ).rejects.toThrow(new NotFoundException('Usuário não encontrado.'));
    });

    it('should throw UnauthorizedException if user type is invalid', async () => {
      const user = { id: 1, type: 'student' };
      mockCompanyRepository.findOne.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(
        service.createCompanyProfile(
          {
            name: 'Test Company',
            description: 'A test company',
            cnpj: '12345678000100',
            field_of_activity: 'IT Services',
            user_id: 1,
          },
          mockRequest,
        ),
      ).rejects.toThrow(
        new UnauthorizedException(
          'Apenas usuários do tipo "empresa" ou "faculdade" podem criar um perfil de empresa.',
        ),
      );
    });
  });

  describe('getCompanyProfile', () => {
    it('should return the company profile', async () => {
      const company = {
        id: 1,
        name: 'Test Company',
        user: { id: 1, type: 'company' },
      };
      mockCompanyRepository.findOne.mockResolvedValue(company);

      const result = await service.getCompanyProfile(mockRequest);

      expect(result).toEqual(company);
      expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockRequest.user.userId } },
        relations: ['user'],
      });
    });

    it('should throw NotFoundException if the profile is not found', async () => {
      mockCompanyRepository.findOne.mockResolvedValue(null);

      await expect(service.getCompanyProfile(mockRequest)).rejects.toThrow(
        new NotFoundException('Perfil de empresa não encontrado.'),
      );
    });
  });

  describe('updateCompanyProfile', () => {
    it('should update the company profile', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company',
        description: 'Updated description',
      };
      const company = { id: 1, name: 'Old Company', user: { id: 1 } };
      const updatedCompany = { ...company, ...updateCompanyDto };

      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockCompanyRepository.save.mockResolvedValue(updatedCompany);

      const result = await service.updateCompanyProfile(
        updateCompanyDto,
        mockRequest,
      );

      expect(result).toEqual(updatedCompany);
      expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockRequest.user.userId } },
      });
      expect(mockCompanyRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateCompanyDto),
      );
    });

    it('should throw NotFoundException if the profile is not found', async () => {
      mockCompanyRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateCompanyProfile({ name: 'Updated Company' }, mockRequest),
      ).rejects.toThrow(
        new NotFoundException('Perfil de empresa não encontrado.'),
      );
    });
  });
});
