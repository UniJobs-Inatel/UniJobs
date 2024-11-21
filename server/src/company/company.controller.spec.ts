import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  const mockCompanyService = {
    createCompanyProfile: jest.fn(),
    getCompanyProfile: jest.fn(),
    updateCompanyProfile: jest.fn(),
  };

  const mockRequest = {
    user: { id: 1, email: 'user@example.com', role: 'company' },
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCompanyProfile', () => {
    it('should create a company profile', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        description: 'A test company description',
        cnpj: '12345678000100',
        field_of_activity: 'IT Services',
        contact_website: 'https://testcompany.com',
        user_id: 1,
      };

      const result = { id: 1, ...createCompanyDto };
      mockCompanyService.createCompanyProfile.mockResolvedValue(result);

      expect(
        await controller.createCompanyProfile(createCompanyDto, mockRequest),
      ).toEqual(result);
      expect(service.createCompanyProfile).toHaveBeenCalledWith(
        createCompanyDto,
        mockRequest,
      );
    });
  });

  describe('getCompanyProfile', () => {
    it('should return a company profile', async () => {
      const result = {
        id: 1,
        name: 'Test Company',
        description: 'A test company description',
        cnpj: '12345678000100',
        field_of_activity: 'IT Services',
        contact_website: 'https://testcompany.com',
      };

      mockCompanyService.getCompanyProfile.mockResolvedValue(result);

      expect(await controller.getCompanyProfile(mockRequest)).toEqual(result);
      expect(service.getCompanyProfile).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('updateCompanyProfile', () => {
    it('should update a company profile', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company Name',
        description: 'Updated description',
        contact_website: 'https://updatedcompany.com',
      };

      const result = {
        id: 1,
        name: 'Updated Company Name',
        description: 'Updated description',
        cnpj: '12345678000100',
        field_of_activity: 'IT Services',
        contact_website: 'https://updatedcompany.com',
      };

      mockCompanyService.updateCompanyProfile.mockResolvedValue(result);

      expect(
        await controller.updateCompanyProfile(updateCompanyDto, mockRequest),
      ).toEqual(result);
      expect(service.updateCompanyProfile).toHaveBeenCalledWith(
        updateCompanyDto,
        mockRequest,
      );
    });
  });
});
