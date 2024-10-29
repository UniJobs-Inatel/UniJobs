/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from '../entities/tag.entity';
import { Repository } from 'typeorm';
import { StudentProficiency } from '../entities/student-proficiency.entity';
import { JobTag } from '../entities/job-tag.entity';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Student } from '../entities/student.entity';
import { Job } from '../entities/job.entity';
import { Company } from '../entities/company.entity';

describe('TagService', () => {
  let service: TagService;
  let tagRepository: Repository<Tag>;
  let studentProficiencyRepository: Repository<StudentProficiency>;
  let jobTagRepository: Repository<JobTag>;

  const mockTagRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockStudentProficiencyRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockJobTagRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        { provide: getRepositoryToken(Tag), useValue: mockTagRepository },
        {
          provide: getRepositoryToken(StudentProficiency),
          useValue: mockStudentProficiencyRepository,
        },
        {
          provide: getRepositoryToken(JobTag),
          useValue: mockJobTagRepository,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    studentProficiencyRepository = module.get<Repository<StudentProficiency>>(
      getRepositoryToken(StudentProficiency),
    );
    jobTagRepository = module.get<Repository<JobTag>>(
      getRepositoryToken(JobTag),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTag', () => {
    it('should create a tag', async () => {
      const tag = { id: 1, name: 'JavaScript' };
      mockTagRepository.create.mockReturnValue(tag);
      mockTagRepository.save.mockResolvedValue(tag);

      const result = await service.createTag('JavaScript');
      expect(result).toEqual(tag);
      expect(mockTagRepository.create).toHaveBeenCalledWith({
        name: 'JavaScript',
      });
      expect(mockTagRepository.save).toHaveBeenCalledWith(tag);
    });

    it('should throw a BadRequestException if tag name is empty', async () => {
      await expect(service.createTag('')).rejects.toThrow(BadRequestException);
      await expect(service.createTag(' ')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTags', () => {
    it('should return an array of tags', async () => {
      const tags = [
        { id: 1, name: 'JavaScript' },
        { id: 2, name: 'TypeScript' },
      ];
      mockTagRepository.find.mockResolvedValue(tags);

      const result = await service.getTags();
      expect(result).toEqual(tags);
      expect(mockTagRepository.find).toHaveBeenCalled();
    });
  });

  describe('updateTag', () => {
    it('should update an existing tag', async () => {
      const tag = { id: 1, name: 'JavaScript' };
      mockTagRepository.findOneBy.mockResolvedValue(tag);
      mockTagRepository.save.mockResolvedValue({ ...tag, name: 'UpdatedTag' });

      const result = await service.updateTag(1, 'UpdatedTag');
      expect(result).toEqual({ ...tag, name: 'UpdatedTag' });
      expect(mockTagRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockTagRepository.save).toHaveBeenCalledWith({
        ...tag,
        name: 'UpdatedTag',
      });
    });

    it('should throw a NotFoundException if tag is not found', async () => {
      mockTagRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateTag(99, 'NewTagName')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTagRepository.findOneBy).toHaveBeenCalledWith({ id: 99 });
    });

    it('should throw a BadRequestException if the new tag name is empty', async () => {
      const tag = { id: 1, name: 'JavaScript' };
      mockTagRepository.findOneBy.mockResolvedValue(tag);

      await expect(service.updateTag(1, '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag', async () => {
      mockTagRepository.findOneBy.mockResolvedValue({
        id: 1,
        name: 'JavaScript',
      });
      mockTagRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteTag(1);
      expect(mockTagRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if the tag is not found', async () => {
      mockTagRepository.findOneBy.mockResolvedValue(null);

      await expect(service.deleteTag(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTagsByStudentId', () => {
    it('should return tags for a student', async () => {
      const tags = [{ id: 1, name: 'JavaScript' }];
      mockStudentProficiencyRepository.find.mockResolvedValue(tags);

      const result = await service.getTagsByStudentId(1, {
        user: { userId: 1 },
      } as any);
      expect(result).toEqual(tags);
      expect(mockStudentProficiencyRepository.find).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException if the student ID does not match', async () => {
      const student = { id: 1, user: { id: 2 } };
      mockStudentProficiencyRepository.findOne.mockResolvedValue(student);

      await expect(
        service.getTagsByStudentId(1, { user: { userId: 99 } } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('createStudentProficiency', () => {
    it('should create a student proficiency', async () => {
      const studentProficiency = { id: 1, student: { id: 1 }, tag: { id: 1 } };
      mockStudentProficiencyRepository.create.mockReturnValue(
        studentProficiency,
      );
      mockStudentProficiencyRepository.save.mockResolvedValue(
        studentProficiency,
      );

      const result = await service.createStudentProficiency(1, 1, {
        user: { userId: 1 },
      } as any);
      expect(result).toEqual(studentProficiency);
      expect(mockStudentProficiencyRepository.create).toHaveBeenCalledWith({
        student: { id: 1 },
        tag: { id: 1 },
      });
      expect(mockStudentProficiencyRepository.save).toHaveBeenCalledWith(
        studentProficiency,
      );
    });
  });
});
