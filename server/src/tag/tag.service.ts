import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { StudentProficiency } from '../entities/student-proficiency.entity';
import { JobTag } from '../entities/job-tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,

    @InjectRepository(StudentProficiency)
    private studentProficiencyRepository: Repository<StudentProficiency>,

    @InjectRepository(JobTag)
    private jobTagRepository: Repository<JobTag>,
  ) {}

  /*--------------- Tags ---------------*/
  async createTag(name: string): Promise<Tag> {
    const newTag = this.tagRepository.create({ name });
    return this.tagRepository.save(newTag);
  }

  async getTags(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async updateTag(id: number, name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOneBy({ id });
    if (tag) {
      tag.name = name;
      return this.tagRepository.save(tag);
    }
    throw new Error('Tag not found');
  }

  async deleteTag(id: number): Promise<void> {
    await this.tagRepository.delete(id);
  }

  async getTagsByStudentId(studentId: number): Promise<Tag[]> {
    const studentProficiencies = await this.studentProficiencyRepository.find({
      where: { student: { id: studentId } },
      relations: ['tag'],
    });

    return studentProficiencies.map((proficiency) => proficiency.tag);
  }

  async getTagsByJobId(jobId: number): Promise<Tag[]> {
    const jobTags = await this.jobTagRepository.find({
      where: { job: { id: jobId } },
      relations: ['tag'],
    });

    return jobTags.map((jobTag) => jobTag.tag);
  }

  /* --------------- StudentProficiency --------------- */
  async createStudentProficiency(
    studentId: number,
    tagId: number,
  ): Promise<StudentProficiency> {
    const newProficiency = this.studentProficiencyRepository.create({
      student: { id: studentId },
      tag: { id: tagId },
    });
    return this.studentProficiencyRepository.save(newProficiency);
  }

  async getStudentProficiencies(
    studentId: number,
  ): Promise<StudentProficiency[]> {
    return this.studentProficiencyRepository.find({
      where: { student: { id: studentId } },
      relations: ['tag'],
    });
  }

  async deleteStudentProficiency(id: number): Promise<void> {
    await this.studentProficiencyRepository.delete(id);
  }

  /* --------------- JobTag --------------- */
  async createJobTag(jobId: number, tagId: number): Promise<JobTag> {
    const newJobTag = this.jobTagRepository.create({
      job: { id: jobId },
      tag: { id: tagId },
    });
    return this.jobTagRepository.save(newJobTag);
  }

  async getJobTags(jobId: number): Promise<JobTag[]> {
    return this.jobTagRepository.find({
      where: { job: { id: jobId } },
      relations: ['tag'],
    });
  }

  async deleteJobTag(id: number): Promise<void> {
    await this.jobTagRepository.delete(id);
  }
}
