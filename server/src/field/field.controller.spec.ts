import { Test, TestingModule } from '@nestjs/testing';
import { FieldController } from './field.controller';
import { FieldService } from './field.service';
import { Field } from '../entities/field.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

describe('FieldController', () => {
  let controller: FieldController;
  let service: FieldService;

  const mockFieldService = {
    getAllFields: jest.fn(),
    getFieldById: jest.fn(),
    createField: jest.fn(),
  };

  const mockFields: Field[] = [
    {
      id: 1,
      field: 'IT',
      jobs: [],
    },
    {
      id: 2,
      field: 'Engineering',
      jobs: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldController],
      providers: [
        {
          provide: FieldService,
          useValue: mockFieldService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(AdminGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<FieldController>(FieldController);
    service = module.get<FieldService>(FieldService);

    jest.clearAllMocks(); // Clear mock calls before each test for isolation.
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllFields', () => {
    it('should return an array of fields', async () => {
      mockFieldService.getAllFields.mockResolvedValue(mockFields);

      const result = await controller.getAllFields();
      expect(result).toEqual(mockFields);
      expect(service.getAllFields).toHaveBeenCalled();
    });
  });

  describe('getFieldById', () => {
    it('should return a field by ID', async () => {
      const field = { id: 1, field: 'IT' };
      mockFieldService.getFieldById.mockResolvedValue(field);

      const result = await controller.getFieldById(1);
      expect(result).toEqual(field);
      expect(service.getFieldById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if field is not found', async () => {
      mockFieldService.getFieldById.mockRejectedValueOnce(
        new Error('Field not found'),
      );

      await expect(controller.getFieldById(999)).rejects.toThrow(
        'Field not found',
      );
      expect(service.getFieldById).toHaveBeenCalledWith(999);
    });
  });

  describe('createField', () => {
    it('should create a new field', async () => {
      const createFieldDto = { field: 'Health' };
      const newField = { id: 3, field: 'Health' };

      mockFieldService.createField.mockResolvedValue(newField);

      const result = await controller.createField(createFieldDto);
      expect(result).toEqual(newField);
      expect(service.createField).toHaveBeenCalledWith(createFieldDto);
    });

    it('should throw an error if field creation fails', async () => {
      const createFieldDto = { field: 'Health' };

      mockFieldService.createField.mockRejectedValueOnce(
        new Error('Field already exists'),
      );

      await expect(controller.createField(createFieldDto)).rejects.toThrow(
        'Field already exists',
      );
      expect(service.createField).toHaveBeenCalledWith(createFieldDto);
    });
  });
});
