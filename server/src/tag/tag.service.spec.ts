import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from '../entities/tag.entity';
import { Repository } from 'typeorm';
import { StudentProficiency } from 'src/entities/student-proficiency.entity';

describe('TagService', () => {
  let service: TagService;
  let tagRepository: Repository<Tag>;
  let studentProficiencyRepository: Repository<StudentProficiency>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTags', () => {
    it('should return an array of tags', async () => {
      const tags: Tag[] = [
        { id: 1, name: 'JavaScript', studentProficiencies: [], jobTags: [] },
        { id: 2, name: 'TypeScript', studentProficiencies: [], jobTags: [] },
      ];

      jest.spyOn(tagRepository, 'find').mockResolvedValue(tags);

      const result = await service.getTags();
      expect(result).toEqual(tags);
      expect(tagRepository.find).toHaveBeenCalled();
    });
  });

  describe('updateTag', () => {
    it('should update an existing tag', async () => {
      const updatedTag = {
        id: 1,
        name: 'UpdatedTag',
        studentProficiencies: [],
        jobTags: [],
      };
      jest
        .spyOn(tagRepository, 'findOneBy')
        .mockResolvedValue(updatedTag as Tag);
      jest.spyOn(tagRepository, 'save').mockResolvedValue(updatedTag);

      const result = await service.updateTag(1, 'UpdatedTag');
      expect(result).toEqual(updatedTag);
      expect(tagRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(tagRepository.save).toHaveBeenCalledWith(updatedTag);
    });

    it('should throw an error if tag is not found', async () => {
      jest.spyOn(tagRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.updateTag(99, 'NewTagName')).rejects.toThrow(
        'Tag not found',
      );
      expect(tagRepository.findOneBy).toHaveBeenCalledWith({ id: 99 });
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag', async () => {
      jest
        .spyOn(tagRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await service.deleteTag(1);
      expect(tagRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if the tag is not found', async () => {
      jest
        .spyOn(tagRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.deleteTag(99)).rejects.toThrow('Tag not found');
    });
  });

  describe('getTagsByStudentId', () => {
    it('should return an empty array if the student has no tags', async () => {
      jest.spyOn(studentProficiencyRepository, 'find').mockResolvedValue([]);
      const result = await service.getTagsByStudentId(1);
      expect(result).toEqual([]);
    });
  });
});
