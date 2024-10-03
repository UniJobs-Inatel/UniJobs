import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { StudentProficiency } from '../entities/student-proficiency.entity';
import { JobTag } from '../entities/job-tag.entity';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { Student } from '../entities/student.entity';
import { Job } from '../entities/job.entity';
import { Company } from '../entities/company.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,

    @InjectRepository(StudentProficiency)
    private studentProficiencyRepository: Repository<StudentProficiency>,

    @InjectRepository(JobTag)
    private jobTagRepository: Repository<JobTag>,

    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  /*--------------- Tags ---------------*/
  async createTag(name: string): Promise<Tag> {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Nome da tag não pode estar vazio.');
    }
    const newTag = this.tagRepository.create({ name });
    return this.tagRepository.save(newTag);
  }

  async getTags(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async updateTag(id: number, name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOneBy({ id });
    if (!tag) {
      throw new NotFoundException('Tag não encontrada.');
    }
    if (!name || name.trim() === '') {
      throw new BadRequestException('Nome da tag não pode estar vazio.');
    }
    tag.name = name;
    return this.tagRepository.save(tag);
  }

  async deleteTag(id: number): Promise<void> {
    const tag = await this.tagRepository.findOneBy({ id });
    if (!tag) {
      throw new NotFoundException('Tag não encontrada.');
    }
    await this.tagRepository.delete(id);
  }

  /* --------------- Protecting User Routes --------------- */

  async getTagsByStudentId(
    studentId: number,
    req: RequestWithUser,
  ): Promise<Tag[]> {
    const jwtUserId = req.user.userId;
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['user'],
    });

    if (!student || student.user.id !== jwtUserId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a acessar esta informação.',
      );
    }

    const studentProficiencies = await this.studentProficiencyRepository.find({
      where: { student: { id: studentId } },
      relations: ['tag'],
    });

    return studentProficiencies.map((proficiency) => proficiency.tag);
  }

  async getTagsByJobId(jobId: number, req: RequestWithUser): Promise<Tag[]> {
    const jwtUserId = req.user.userId;
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['company', 'company.user'],
    });

    if (!job || job.company.user.id !== jwtUserId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a acessar esta informação.',
      );
    }

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
    req: RequestWithUser,
  ): Promise<StudentProficiency> {
    const jwtUserId = req.user.userId;
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['user'],
    });

    if (!student || student.user.id !== jwtUserId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a criar esta proficiência.',
      );
    }

    const newProficiency = this.studentProficiencyRepository.create({
      student: { id: studentId },
      tag: { id: tagId },
    });
    return this.studentProficiencyRepository.save(newProficiency);
  }

  async getStudentProficiencies(
    studentId: number,
    req: RequestWithUser,
  ): Promise<StudentProficiency[]> {
    const jwtUserId = req.user.userId;
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['user'],
    });

    if (!student || student.user.id !== jwtUserId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a acessar estas proficiências.',
      );
    }

    return this.studentProficiencyRepository.find({
      where: { student: { id: studentId } },
      relations: ['tag'],
    });
  }

  async deleteStudentProficiency(
    id: number,
    req: RequestWithUser,
  ): Promise<void> {
    const proficiency = await this.studentProficiencyRepository.findOne({
      where: { id },
      relations: ['student', 'student.user'],
    });

    if (!proficiency || proficiency.student.user.id !== req.user.userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a deletar esta proficiência.',
      );
    }

    await this.studentProficiencyRepository.delete(id);
  }

  /* --------------- JobTag --------------- */
  async createJobTag(
    jobId: number,
    tagId: number,
    req: RequestWithUser,
  ): Promise<JobTag> {
    const jwtUserId = req.user.userId;
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['company', 'company.user'],
    });

    if (!job || job.company.user.id !== jwtUserId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a criar esta tag de trabalho.',
      );
    }

    const newJobTag = this.jobTagRepository.create({
      job: { id: jobId },
      tag: { id: tagId },
    });
    return this.jobTagRepository.save(newJobTag);
  }

  async getJobTags(jobId: number, req: RequestWithUser): Promise<JobTag[]> {
    const jwtUserId = req.user.userId;
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['company', 'company.user'],
    });

    if (!job || job.company.user.id !== jwtUserId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a acessar estas tags de trabalho.',
      );
    }

    return this.jobTagRepository.find({
      where: { job: { id: jobId } },
      relations: ['tag'],
    });
  }

  async deleteJobTag(id: number, req: RequestWithUser): Promise<void> {
    const jobTag = await this.jobTagRepository.findOne({
      where: { id },
      relations: ['job', 'job.company', 'job.company.user'],
    });

    if (!jobTag || jobTag.job.company.user.id !== req.user.userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a deletar esta tag de trabalho.',
      );
    }

    await this.jobTagRepository.delete(id);
  }
}
