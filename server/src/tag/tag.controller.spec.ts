import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { AdminGuard } from '../auth/admin.guard';
import { ConfigService } from '@nestjs/config';
import { Tag } from 'src/entities/tag.entity';

describe('TagController', () => {
  let controller: TagController;
  let service: TagService;

  const mockRequest = {
    user: {
      userId: 1,
      type: 'student',
      email: 'student@example.com',
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: {
            createTag: jest.fn(),
            getTags: jest.fn(),
            getTagsByStudentId: jest.fn(),
            getTagsByJobId: jest.fn(),
            updateTag: jest.fn(),
            deleteTag: jest.fn(),
            createStudentProficiency: jest.fn(),
            getStudentProficiencies: jest.fn(),
            deleteStudentProficiency: jest.fn(),
            createJobTag: jest.fn(),
            getJobTags: jest.fn(),
            deleteJobTag: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked-value'),
          },
        },
      ],
    })
      .overrideGuard(AdminGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getTags', () => {
    it('should return an array of tags', async () => {
      const tags: Partial<Tag>[] = [
        {
          id: 1,
          name: 'JavaScript',
          studentProficiencies: [],
          jobTags: [],
        },
        {
          id: 2,
          name: 'TypeScript',
          studentProficiencies: [],
          jobTags: [],
        },
      ];

      jest.spyOn(service, 'getTags').mockResolvedValue(tags as Tag[]);

      const result = await controller.getTags();
      expect(result).toEqual(tags);
      expect(service.getTags).toHaveBeenCalled();
    });
  });

  describe('getTagsByStudentId', () => {
    it('should return tags for a student', async () => {
      const tags: Partial<Tag>[] = [
        { id: 1, name: 'JavaScript', studentProficiencies: [], jobTags: [] },
      ];

      jest
        .spyOn(service, 'getTagsByStudentId')
        .mockResolvedValue(tags as Tag[]);

      const result = await controller.getTagsByStudentId(1, mockRequest);
      expect(result).toEqual(tags);
      expect(service.getTagsByStudentId).toHaveBeenCalledWith(1, mockRequest);
    });
  });

  describe('getTagsByJobId', () => {
    it('should return tags for a job', async () => {
      const tags: Partial<Tag>[] = [
        { id: 1, name: 'TypeScript', studentProficiencies: [], jobTags: [] },
      ];

      jest.spyOn(service, 'getTagsByJobId').mockResolvedValue(tags as Tag[]);

      const result = await controller.getTagsByJobId(1, mockRequest);
      expect(result).toEqual(tags);
      expect(service.getTagsByJobId).toHaveBeenCalledWith(1, mockRequest);
    });
  });

  describe('updateTag', () => {
    it('should call the service to update a tag', async () => {
      const updatedTag: Partial<Tag> = {
        id: 1,
        name: 'UpdatedTag',
        studentProficiencies: [],
        jobTags: [],
      };
      jest.spyOn(service, 'updateTag').mockResolvedValue(updatedTag as Tag);

      const result = await controller.updateTag(1, 'UpdatedTag');
      expect(result).toEqual(updatedTag);
      expect(service.updateTag).toHaveBeenCalledWith(1, 'UpdatedTag');
    });
  });

  describe('deleteTag', () => {
    it('should call the service to delete a tag', async () => {
      jest.spyOn(service, 'deleteTag').mockResolvedValue();

      await controller.deleteTag(1);
      expect(service.deleteTag).toHaveBeenCalledWith(1);
    });
  });

  describe('createTag', () => {
    it('should create a tag successfully', async () => {
      const createdTag: Partial<Tag> = {
        id: 1,
        name: 'JavaScript',
        studentProficiencies: [],
        jobTags: [],
      };

      jest.spyOn(service, 'createTag').mockResolvedValue(createdTag as Tag);

      const result = await controller.createTag({ name: 'JavaScript' });
      expect(result).toEqual(createdTag);
      expect(service.createTag).toHaveBeenCalledWith('JavaScript');
    });

    it('should throw an error if tag name is empty', async () => {
      await expect(controller.createTag({ name: '' })).rejects.toThrow(
        'Nome da tag não pode estar vazio.',
      );
    });
  });

  describe('createStudentProficiency', () => {
    it('should create a student proficiency successfully', async () => {
      const studentProficiency = { id: 1, student: { id: 1 }, tag: { id: 1 } };

      jest
        .spyOn(service, 'createStudentProficiency')
        .mockResolvedValue(studentProficiency as any);

      const result = await controller.createStudentProficiency(
        1,
        1,
        mockRequest,
      );
      expect(result).toEqual(studentProficiency);
      expect(service.createStudentProficiency).toHaveBeenCalledWith(
        1,
        1,
        mockRequest,
      );
    });
  });

  describe('getStudentProficiencies', () => {
    it('should return an array of student proficiencies', async () => {
      const studentProficiencies = [
        { id: 1, tag: { id: 1, name: 'JavaScript' } },
      ];

      jest
        .spyOn(service, 'getStudentProficiencies')
        .mockResolvedValue(studentProficiencies as any);

      const result = await controller.getStudentProficiencies(1, mockRequest);
      expect(result).toEqual(studentProficiencies);
      expect(service.getStudentProficiencies).toHaveBeenCalledWith(
        1,
        mockRequest,
      );
    });
  });

  describe('deleteStudentProficiency', () => {
    it('should call the service to delete a student proficiency', async () => {
      jest.spyOn(service, 'deleteStudentProficiency').mockResolvedValue();

      await controller.deleteStudentProficiency(1, 1, mockRequest);
      expect(service.deleteStudentProficiency).toHaveBeenCalledWith(
        1,
        1,
        mockRequest,
      );
    });
  });

  describe('createJobTag', () => {
    it('should create a job tag successfully', async () => {
      const jobTag = { id: 1, job: { id: 1 }, tag: { id: 1 } };

      jest.spyOn(service, 'createJobTag').mockResolvedValue(jobTag as any);

      const result = await controller.createJobTag(1, 1, mockRequest);
      expect(result).toEqual(jobTag);
      expect(service.createJobTag).toHaveBeenCalledWith(1, 1, mockRequest);
    });
  });

  describe('getJobTags', () => {
    it('should return an array of job tags', async () => {
      const jobTags = [{ id: 1, tag: { id: 1, name: 'JavaScript' } }];

      jest.spyOn(service, 'getJobTags').mockResolvedValue(jobTags as any);

      const result = await controller.getJobTags(1, mockRequest);
      expect(result).toEqual(jobTags);
      expect(service.getJobTags).toHaveBeenCalledWith(1, mockRequest);
    });
  });

  describe('deleteJobTag', () => {
    it('should call the service to delete a job tag', async () => {
      jest.spyOn(service, 'deleteJobTag').mockResolvedValue();

      await controller.deleteJobTag(1, 1, mockRequest);

      expect(service.deleteJobTag).toHaveBeenCalledWith(1, 1, mockRequest);
    });
  });
});
