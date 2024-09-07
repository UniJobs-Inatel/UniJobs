import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { Tag } from '../entities/tag.entity';

describe('TagController', () => {
  let controller: TagController;
  let service: TagService;

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
          },
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTags', () => {
    it('should return an array of tags', async () => {
      const tags: Partial<Tag>[] = [
        { id: 1, name: 'JavaScript' },
        { id: 2, name: 'TypeScript' },
      ];

      jest.spyOn(service, 'getTags').mockResolvedValue(tags as Tag[]);

      const result = await controller.getTags();
      expect(result).toEqual(tags);
      expect(service.getTags).toHaveBeenCalled();
    });
  });

  describe('getTagsByStudentId', () => {
    it('should return tags for a student', async () => {
      const tags: Partial<Tag>[] = [{ id: 1, name: 'JavaScript' }];

      jest
        .spyOn(service, 'getTagsByStudentId')
        .mockResolvedValue(tags as Tag[]);

      const result = await controller.getTagsByStudentId(1);
      expect(result).toEqual(tags);
      expect(service.getTagsByStudentId).toHaveBeenCalledWith(1);
    });
  });

  describe('getTagsByJobId', () => {
    it('should return tags for a job', async () => {
      const tags: Partial<Tag>[] = [{ id: 1, name: 'TypeScript' }];

      jest.spyOn(service, 'getTagsByJobId').mockResolvedValue(tags as Tag[]);

      const result = await controller.getTagsByJobId(1);
      expect(result).toEqual(tags);
      expect(service.getTagsByJobId).toHaveBeenCalledWith(1);
    });
  });

  describe('updateTag', () => {
    it('should call the service to update a tag', async () => {
      const updatedTag: Partial<Tag> = { id: 1, name: 'UpdatedTag' };
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
    it('should throw an error if tag name is empty', async () => {
      await expect(controller.createTag({ name: '' })).rejects.toThrow(
        'Tag name cannot be empty',
      );
    });
  });
});
