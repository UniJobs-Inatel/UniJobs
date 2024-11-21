import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JobPublication } from '../entities/job-publication.entity';
import { JobTag } from '../entities/job-tag.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobPublicationDto } from './dto/create-job-publication.dto';
import { UpdateJobPublicationDto } from './dto/update-job-publication.dto';
import { Company } from '../entities/company.entity';
import { Student } from 'src/entities/student.entity';
import { College } from '../entities/college.entity';
import { Field } from '../entities/field.entity';
import { FavoriteJobs } from 'src/entities/favorite-jobs.entity';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(JobTag)
    private readonly jobTagRepository: Repository<JobTag>,
    @InjectRepository(JobPublication)
    private readonly jobPublicationRepository: Repository<JobPublication>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(FavoriteJobs)
    private readonly favoriteJobsRepository: Repository<FavoriteJobs>,
  ) {}

  async createJob(createJobDto: CreateJobDto, req: RequestWithUser) {
    const { field_id, ...jobData } = createJobDto;
    const userId = req.user.userId;

    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    const field = await this.fieldRepository.findOne({
      where: { id: field_id },
    });

    if (!field) {
      throw new NotFoundException('Área de atuação não encontrada.');
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

  async searchJobs(
    filters: {
      location?: string;
      type?: string;
      skills?: number[];
      salaryRange?: { min: number; max: number };
      mode?: string;
      weeklyHours?: number;
      fieldId?: number;
    },
    pagination: { limit: number; offset: number },
  ) {
    const { location, type, skills, salaryRange, mode, weeklyHours, fieldId } =
      filters;
    const { limit, offset } = pagination;

    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.field', 'field')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.tags', 'jobTags')
      .leftJoinAndSelect('jobTags.tag', 'tag')
      .where('1=1');

    if (location) {
      query.andWhere('job.location = :location', { location });
    }
    if (type) {
      query.andWhere('job.type = :type', { type });
    }
    if (skills && skills.length > 0) {
      query.andWhere('tag.id IN (:...skills)', { skills });
    }
    if (salaryRange) {
      query.andWhere('job.salary BETWEEN :min AND :max', {
        min: salaryRange.min,
        max: salaryRange.max,
      });
    }
    if (mode) {
      query.andWhere('job.mode = :mode', { mode });
    }
    if (weeklyHours) {
      query.andWhere('job.weekly_hours = :weeklyHours', { weeklyHours });
    }
    if (fieldId) {
      query.andWhere('job.field_id = :fieldId', { fieldId });
    }

    query.take(limit).skip(offset);

    const [jobs, total] = await query.getManyAndCount();

    return {
      jobs,
      total,
      pageCount: Math.ceil(total / limit),
      currentPage: Math.floor(offset / limit) + 1,
    };
  }

  async getJobById(id: number) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['field', 'company'],
    });

    if (!job) {
      throw new NotFoundException('Vaga não encontrada.');
    }

    return job;
  }

  async getJobsByCompany(req: RequestWithUser) {
    const userId = req.user.userId;

    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!company) {
      throw new Error('Company not found for this user');
    }

    const jobList = await this.jobRepository.find({
      where: { company: { id: company.id } },
      relations: ['company'],
    });

    const jobListWithPublicationStatus = await Promise.all(
      jobList.map(async (job) => {
        const isPublishedOnAllColleges =
          await this.checkIfJobIsPublishedOnAllColleges(job.id);
        return { ...job, isPublishedOnAllColleges };
      }),
    );

    return jobListWithPublicationStatus;
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
      throw new NotFoundException('Vaga não encontrada.');
    }

    const userId = req.user.userId;
    if (job.company.user.id !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a atualizar esta vaga.',
      );
    }

    if (updateJobDto.field_id) {
      const field = await this.fieldRepository.findOne({
        where: { id: updateJobDto.field_id },
      });
      if (!field) {
        throw new NotFoundException('Área de atuação não encontrada.');
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
      throw new NotFoundException('Vaga não encontrada.');
    }

    const userId = req.user.userId;
    if (job.company.user.id !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a deletar esta vaga.',
      );
    }

    await this.jobRepository.delete(id);
    return { message: 'Vaga deletada com sucesso.' };
  }

  /* ---------------------Job Publication -----------------------------------*/

  async getFilteredJobPublications(
    req: RequestWithUser,
    filters: {
      location?: string;
      type?: string;
      skills?: number[];
      salaryRange?: { min: number; max: number };
      mode?: string;
      weeklyHours?: number;
      fieldId?: number;
    },
    pagination: { limit: number; offset: number },
  ) {
    const { location, type, skills, salaryRange, mode, weeklyHours, fieldId } =
      filters;
    const { limit, offset } = pagination;

    const student = await this.studentRepository.findOne({
      where: { user: { id: req.user.userId } },
      relations: ['college'],
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const collegeId = student.college.id;

    const favorites = await this.favoriteJobsRepository.find({
      where: { student: { id: student.id } },
      relations: ['jobPublication'],
    });

    const favoriteIds = favorites.map((favorite) => favorite.jobPublication.id);

    const query = this.jobPublicationRepository
      .createQueryBuilder('job_publication')
      .leftJoinAndSelect('job_publication.job', 'job')
      .leftJoinAndSelect('job.field', 'field')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.tags', 'jobTags')
      .leftJoinAndSelect('jobTags.tag', 'tag')
      .where('job_publication.college_id = :collegeId', { collegeId })
      .andWhere('job_publication.status = :status', { status: 'approved' });

    if (location) {
      query.andWhere('job.location = :location', { location });
    }
    if (type) {
      query.andWhere('job.type = :type', { type });
    }
    if (skills && skills.length > 0) {
      query.andWhere('tag.id IN (:...skills)', { skills });
    }
    if (salaryRange) {
      query.andWhere('job.salary BETWEEN :min AND :max', {
        min: salaryRange.min,
        max: salaryRange.max,
      });
    }
    if (mode) {
      query.andWhere('job.mode = :mode', { mode });
    }
    if (weeklyHours) {
      query.andWhere('job.weekly_hours = :weeklyHours', { weeklyHours });
    }
    if (fieldId) {
      query.andWhere('job.field_id = :fieldId', { fieldId });
    }

    query.take(limit).skip(offset);

    const [publications, total] = await query.getManyAndCount();

    const jobPublications = publications.map((publication) => ({
      ...publication,
      isFavorite: favoriteIds.includes(publication.id),
    }));

    return {
      publications: jobPublications,
      total,
      pageCount: Math.ceil(total / limit),
      currentPage: Math.floor(offset / limit) + 1,
    };
  }

  async createJobPublication(
    createJobPublicationDto: CreateJobPublicationDto,
    req: RequestWithUser,
  ) {
    const userId = req.user.userId;

    const job = await this.jobRepository.findOne({
      where: { id: createJobPublicationDto.job_id },
      relations: ['company'],
    });

    if (!job) {
      throw new NotFoundException('Vaga não encontrada.');
    }

    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    if (job.company.id !== company.id) {
      throw new UnauthorizedException('Vaga não pertence a empresa informada.');
    }

    let college = null;
    if (createJobPublicationDto.college_id) {
      college = await this.collegeRepository.findOne({
        where: { id: createJobPublicationDto.college_id },
        relations: ['company'],
      });
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

  async getJobPublicationsByCompany(req: RequestWithUser) {
    const userId = req.user.userId;

    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
    });

    return await this.jobPublicationRepository.find({
      where: { company: { id: company.id } },
      relations: ['job', 'college', 'company'],
    });
  }

  async getJobPublicationsByCollege(req: RequestWithUser) {
    const userId = req.user.userId;

    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!company) {
      throw new Error('Company not found for the current user.');
    }

    const college = await this.collegeRepository.findOne({
      where: { company: { id: company.id } },
    });

    if (!college) {
      throw new Error('College not found for the current company.');
    }

    const jobPublications = await this.jobPublicationRepository.find({
      where: { college: { id: college.id } },
      relations: [
        'job',
        'job.field',
        'job.company',
        'job.tags',
        'job.tags.tag',
        'college',
        'college.company',
      ],
    });

    return jobPublications;
  }

  async getJobPublicationsByUser(req: RequestWithUser) {
    const student = await this.studentRepository.findOne({
      where: { user: { id: req.user.userId } },
      relations: ['college'],
    });

    const college = await this.collegeRepository.findOne({
      where: { id: student.college.id },
    });

    const publications = await this.jobPublicationRepository.find({
      where: { college: { id: college.id }, status: 'approved' },
      relations: ['job', 'college', 'company'],
    });

    const favorites = await this.favoriteJobsRepository.find({
      where: { student: { id: student.id } },
      relations: ['jobPublication'],
    });

    const jobPublications = publications.map((publication) => {
      const isFavorite = favorites.some(
        (favorite) => favorite.jobPublication.id === publication.id,
      );
      return { ...publication, isFavorite };
    });

    console.log(jobPublications);

    return jobPublications;
  }

  async getCollegesWhereJobIsNotPublished(jobId: number) {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Vaga não encontrada.');
    }

    const publications = await this.jobPublicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['college'],
    });

    const collegeIds = publications.map(
      (publication) => publication.college.id,
    );

    return await this.collegeRepository.find({
      where: { id: Not(In(collegeIds)) },
      relations: ['company'],
    });
  }

  async checkIfJobIsPublishedOnAllColleges(jobId: number) {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Vaga não encontrada.');
    }

    const colleges = await this.collegeRepository.find();

    const publications = await this.jobPublicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['college'],
    });

    const collegeIds = publications.map(
      (publication) => publication.college.id,
    );

    return colleges.every((college) => collegeIds.includes(college.id));
  }

  async updateJobPublication(
    id: number,
    updateJobPublicationDto: UpdateJobPublicationDto,
    req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    const jobPublication = await this.jobPublicationRepository.findOne({
      where: { id },
      relations: ['college', 'company'],
    });

    if (!jobPublication) {
      throw new NotFoundException('Publicação de vaga não encontrada.');
    }

    const companyRelatedtoUser = await this.companyRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!companyRelatedtoUser) {
      throw new NotFoundException('Usuário não é uma empresa ou IE.');
    }

    const collegeRelatedToUser = await this.collegeRepository.findOne({
      where: { company: { id: companyRelatedtoUser.id } },
    });

    const collegeRelatedToUser_id = collegeRelatedToUser
      ? collegeRelatedToUser.id
      : null; // Either the ID or null, for comparison purposes

    if (
      updateJobPublicationDto.status === 'approved' ||
      updateJobPublicationDto.status === 'reproved'
    ) {
      if (jobPublication.college.id !== collegeRelatedToUser_id) {
        throw new UnauthorizedException(
          'Apenas a faculdade pode aprovar ou reprovar essa publicação.',
        );
      }
    }

    if (updateJobPublicationDto.status === 'removed') {
      if (
        jobPublication.company.id !== companyRelatedtoUser.id && // Empresa que publicou é diferente da empresa administrada pelo usuário
        jobPublication.college.id !== collegeRelatedToUser_id // Faculdade que recebeu a publicação é diferente da faculdade administrada pelo usuário
      ) {
        throw new UnauthorizedException(
          'Apenas a empresa ou a faculdade pode remover uma publicação.',
        );
      }
    }

    if (updateJobPublicationDto.status === 'pending') {
      if (jobPublication.company.id !== companyRelatedtoUser.id) {
        throw new UnauthorizedException(
          'Apenas a empresa pode republicar uma publicação.',
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
    } else if (currentStatus === 'removed' && newStatus === 'pending') {
      jobPublication.status = 'pending';
    } else if (currentStatus === 'reproved' && newStatus === 'pending') {
      jobPublication.status = 'pending';
    } else {
      throw new BadRequestException(
        `Transição de status inválida de ${currentStatus} para ${newStatus}.`,
      );
    }

    return await this.jobPublicationRepository.save(jobPublication);
  }
}
