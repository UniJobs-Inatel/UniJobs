import { Test, TestingModule } from '@nestjs/testing';
import { CollegeController } from './college.controller';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college-dto';
import { CreateValidEmailDto } from './dto/create-valid-email-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

describe('CollegeController', () => {
  let controller: CollegeController;
  let service: CollegeService;

  const mockCollegeService = {
    createCollege: jest.fn(),
    createValidEmail: jest.fn(),
    deleteValidEmail: jest.fn(),
    listValidEmails: jest.fn(),
    listAllValidEmails: jest.fn(),
  };

  const mockRequest = {
    user: { id: 1, email: 'admin@example.com', role: 'admin' },
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollegeController],
      providers: [
        {
          provide: CollegeService,
          useValue: mockCollegeService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<CollegeController>(CollegeController);
    service = module.get<CollegeService>(CollegeService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCollege', () => {
    it('should create a college', async () => {
      const createCollegeDto: CreateCollegeDto = {
        company_id: 1,
      };

      const result = { id: 1, company_id: 1 };
      mockCollegeService.createCollege.mockResolvedValue(result);

      expect(
        await controller.createCollege(createCollegeDto, mockRequest),
      ).toEqual(result);
      expect(service.createCollege).toHaveBeenCalledWith(
        createCollegeDto,
        mockRequest,
      );
    });
  });

  describe('createValidEmail', () => {
    it('should create a valid email', async () => {
      const createValidEmailDto: CreateValidEmailDto = {
        domain: 'test.com',
        college_id: 1,
      };

      const result = { id: 1, ...createValidEmailDto };
      mockCollegeService.createValidEmail.mockResolvedValue(result);

      expect(
        await controller.createValidEmail(createValidEmailDto, mockRequest),
      ).toEqual(result);
      expect(service.createValidEmail).toHaveBeenCalledWith(
        createValidEmailDto,
        mockRequest,
      );
    });
  });

  describe('deleteValidEmail', () => {
    it('should delete a valid email by id', async () => {
      const emailId = 1;
      mockCollegeService.deleteValidEmail.mockResolvedValue(undefined);

      await controller.deleteValidEmail(emailId, mockRequest);
      expect(service.deleteValidEmail).toHaveBeenCalledWith(
        emailId,
        mockRequest,
      );
    });
  });

  describe('listValidEmails', () => {
    it('should list valid emails for a specific college', async () => {
      const collegeId = 1;
      const result = [{ id: 1, domain: '@test.com', college_id: collegeId }];

      mockCollegeService.listValidEmails.mockResolvedValue(result);

      expect(await controller.listValidEmails(collegeId, mockRequest)).toEqual(
        result,
      );
      expect(service.listValidEmails).toHaveBeenCalledWith(
        collegeId,
        mockRequest,
      );
    });
  });

  describe('listAllValidEmails', () => {
    it('should list all valid emails', async () => {
      const result = [
        { id: 1, domain: 'valid@test.com', college_id: 1 },
        { id: 2, domain: 'another@test.com', college_id: 2 },
      ];

      mockCollegeService.listAllValidEmails.mockResolvedValue(result);

      expect(await controller.listAllValidEmails(mockRequest)).toEqual(result);
      expect(service.listAllValidEmails).toHaveBeenCalledWith(mockRequest);
    });
  });
});
