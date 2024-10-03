import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JobPublication } from '../entities/job-publication.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobPublicationDto } from './dto/create-job-publication.dto';
import { UpdateJobPublicationDto } from './dto/update-job-publication.dto';
import { Company } from '../entities/company.entity';
import { College } from '../entities/college.entity';
import { Field } from '../entities/field.entity';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(JobPublication)
    private readonly jobPublicationRepository: Repository<JobPublication>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async createJob(createJobDto: CreateJobDto, req: RequestWithUser) {
    const { company_id, field_id, ...jobData } = createJobDto;
    const userId = req.user.userId;

    const company = await this.companyRepository.findOne({
      where: { id: company_id },
      relations: ['user'],
    });

    if (!company) {
      throw new Error('Company not found');
    }

    if (company.user.id !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a realizar essa ação',
      );
    }

    const field = await this.fieldRepository.findOne({
      where: { id: field_id },
    });

    if (!field) {
      throw new Error('Field not found');
    }

    const job = this.jobRepository.create({
      ...jobData,
      company,
      field,
    });

    return await this.jobRepository.save(job);
  }

  async getAllJobs() {
    return await this.jobRepository.find({
      relations: ['field', 'company'],
    });
  }

  async getJobById(id: number) {
    return await this.jobRepository.findOne({
      where: { id },
      relations: ['field', 'company'],
    });
  }

  async updateJob(
    id: number,
    updateJobDto: UpdateJobDto,
    req: RequestWithUser,
  ) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!job) {
      throw new Error('Job not found');
    }

    const userId = req.user.userId;
    if (job.company.user.id !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a realizar essa ação',
      );
    }

    if (updateJobDto.field_id) {
      const field = await this.fieldRepository.findOne({
        where: { id: updateJobDto.field_id },
      });
      if (!field) {
        throw new Error('Field not found');
      }
      job.field = field;
    }

    Object.assign(job, updateJobDto);

    return await this.jobRepository.save(job);
  }

  async deleteJob(id: number, req: RequestWithUser) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!job) {
      throw new Error('Job not found');
    }

    const userId = req.user.userId;
    if (job.company.user.id !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a realizar essa ação',
      );
    }

    return await this.jobRepository.delete(id);
  }

  async createJobPublication(
    createJobPublicationDto: CreateJobPublicationDto,
    req: RequestWithUser,
  ) {
    const userId = req.user.userId;

    const job = await this.jobRepository.findOne({
      where: { id: createJobPublicationDto.job_id },
    });
    const company = await this.companyRepository.findOne({
      where: { id: createJobPublicationDto.company_id },
      relations: ['user'],
    });

    if (!job || !company) {
      throw new Error('Job or company not found');
    }

    if (company.user.id !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a realizar essa ação',
      );
    }

    let college = null;
    if (createJobPublicationDto.college_id) {
      college = await this.collegeRepository.findOne({
        where: { id: createJobPublicationDto.college_id },
        relations: ['company'],
      });

      if (college && college.company.user.id !== userId) {
        throw new UnauthorizedException(
          'Usuário não autorizado a realizar essa ação',
        );
      }
    }

    const jobPublication = this.jobPublicationRepository.create({
      job,
      company,
      college,
      status: 'pending',
      publication_request_date: new Date(),
      publication_date: null,
    });

    return await this.jobPublicationRepository.save(jobPublication);
  }

  async getJobsByCompany(companyId: number, req: RequestWithUser) {
    const userId = req.user.userId;

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['user'],
    });

    if (!company || company.user.id !== userId) {
      throw new UnauthorizedException(
        'Apenas a própria empresa pode ver suas publicações de vaga',
      );
    }

    return await this.jobRepository.find({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
  }

  async getJobPublicationsByCompany(companyId: number, req: RequestWithUser) {
    const userId = req.user.userId;

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['user'],
    });

    if (!company || company.user.id !== userId) {
      throw new UnauthorizedException(
        'Apenas a própria empresa pode ver suas publicações de vaga',
      );
    }

    return await this.jobPublicationRepository.find({
      where: { company: { id: companyId } },
      relations: ['job', 'college', 'company'],
    });
  }

  async getJobPublicationsByCollege(collegeId: number, req: RequestWithUser) {
    const userId = req.user.userId;

    const college = await this.collegeRepository.findOne({
      where: { id: collegeId },
      relations: ['company'],
    });

    if (!college || college.company.user.id !== userId) {
      throw new UnauthorizedException(
        'Apenas a própria faculdade pode gerenciar as vagas publicadas em seu feed',
      );
    }

    return await this.jobPublicationRepository.find({
      where: { college: { id: collegeId } },
      relations: ['job', 'college', 'company'],
    });
  }

  async updateJobPublication(
    id: number,
    updateJobPublicationDto: UpdateJobPublicationDto,
    req: RequestWithUser,
  ) {
    const jobPublication = await this.jobPublicationRepository.findOne({
      where: { id },
      relations: ['college', 'company'],
    });

    if (!jobPublication) {
      throw new Error('Job Publication not found');
    }

    const userId = req.user.userId;

    if (
      updateJobPublicationDto.status === 'approved' ||
      updateJobPublicationDto.status === 'reproved'
    ) {
      if (
        jobPublication.college &&
        jobPublication.college.company.user.id !== userId
      ) {
        throw new UnauthorizedException(
          'Apenas a faculdade pode aprovar ou reprovar uma publicação',
        );
      }
    }

    if (updateJobPublicationDto.status === 'removed') {
      if (
        jobPublication.company.user.id !== userId &&
        jobPublication.college?.company.user.id !== userId
      ) {
        throw new UnauthorizedException(
          'Apenas a empresa ou a faculdade pode remover uma publicação',
        );
      }
    }

    const currentStatus = jobPublication.status;
    const newStatus = updateJobPublicationDto.status;

    if (currentStatus === 'pending' && newStatus === 'reproved') {
      jobPublication.status = 'reproved';
    } else if (currentStatus === 'pending' && newStatus === 'approved') {
      jobPublication.status = 'approved';
      jobPublication.publication_date = new Date();
    } else if (currentStatus === 'approved' && newStatus === 'removed') {
      jobPublication.status = 'removed';
    } else {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }

    return await this.jobPublicationRepository.save(jobPublication);
  }
}
