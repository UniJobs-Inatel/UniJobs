import { Test, TestingModule } from '@nestjs/testing';
import { FieldService } from './field.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from '../entities/field.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('FieldService', () => {
  let service: FieldService;
  let fieldRepository: Repository<Field>;

  const mockFieldRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FieldService,
        {
          provide: getRepositoryToken(Field),
          useValue: mockFieldRepository,
        },
      ],
    }).compile();

    service = module.get<FieldService>(FieldService);
    fieldRepository = module.get<Repository<Field>>(getRepositoryToken(Field));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllFields', () => {
    it('should return an array of fields', async () => {
      const fields = [
        { id: 1, field: 'IT' },
        { id: 2, field: 'Engineering' },
      ];
      mockFieldRepository.find.mockResolvedValue(fields);

      const result = await service.getAllFields();
      expect(result).toEqual(fields);
      expect(fieldRepository.find).toHaveBeenCalled();
    });
  });

  describe('getFieldById', () => {
    it('should return a field by ID', async () => {
      const field = { id: 1, field: 'IT' };
      mockFieldRepository.findOneBy.mockResolvedValue(field);

      const result = await service.getFieldById(1);
      expect(result).toEqual(field);
      expect(fieldRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if field is not found', async () => {
      mockFieldRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getFieldById(999)).rejects.toThrow(
        new NotFoundException('Área de atuação não encontrada.'),
      );
      expect(fieldRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('createField', () => {
    it('should create a new field', async () => {
      const createFieldDto = { field: 'Health' };
      const newField = { id: 3, field: 'Health' };

      mockFieldRepository.create.mockReturnValue(newField);
      mockFieldRepository.save.mockResolvedValue(newField);

      const result = await service.createField(createFieldDto);
      expect(result).toEqual(newField);
      expect(fieldRepository.create).toHaveBeenCalledWith(createFieldDto);
      expect(fieldRepository.save).toHaveBeenCalledWith(newField);
    });

    it('should throw BadRequestException if the field name is empty', async () => {
      const createFieldDto = { field: '  ' };

      await expect(service.createField(createFieldDto)).rejects.toThrow(
        new BadRequestException(
          'O nome da área de atuação não pode estar vazio.',
        ),
      );
    });
  });

  describe('populateFields', () => {
    it('should populate fields if no fields exist', async () => {
      mockFieldRepository.count.mockResolvedValue(0);
      mockFieldRepository.create.mockImplementation((field) => field);
      mockFieldRepository.save.mockResolvedValue([]);

      await service.populateFields();

      expect(fieldRepository.count).toHaveBeenCalled();
      expect(fieldRepository.save).toHaveBeenCalled();
    });

    it('should not populate fields if fields already exist', async () => {
      mockFieldRepository.count.mockResolvedValue(5);

      await service.populateFields();

      expect(fieldRepository.count).toHaveBeenCalled();
      expect(fieldRepository.save).not.toHaveBeenCalled();
    });
  });
});
