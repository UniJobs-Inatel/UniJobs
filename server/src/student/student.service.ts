import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { Experience } from '../entities/experience.entity';
import { StudentProficiency } from '../entities/student-proficiency.entity';
import { ValidEmail } from '../entities/valid-email.entity';
import { User } from '../entities/user.entity';
import { Tag } from '../entities/tag.entity';
import { FavoriteJobs } from '../entities/favorite-jobs.entity';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { JobPublication } from '../entities/job-publication.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    @InjectRepository(StudentProficiency)
    private readonly studentProficiencyRepository: Repository<StudentProficiency>,
    @InjectRepository(ValidEmail)
    private readonly validEmailRepository: Repository<ValidEmail>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(JobPublication)
    private readonly jobPublicationRepository: Repository<JobPublication>,
    @InjectRepository(FavoriteJobs)
    private readonly favoriteJobsRepository: Repository<FavoriteJobs>,
  ) {}

  /* Profile */
  async getProfileByUser(req: RequestWithUser) {
    const userId = req.user.userId;

    const student = await this.studentRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'college', 'experiences', 'proficiencies'],
    });
    if (!student) {
      throw new NotFoundException('Perfil de estudante não encontrado.');
    }

    return student;
  }

  private async getCollegeIdByEmailDomain(email: string): Promise<number> {
    const emailDomain = email.split('@')[1];

    const validEmail = await this.validEmailRepository.findOne({
      where: { domain: emailDomain },
      relations: ['college'],
    });

    if (validEmail && validEmail.college) {
      return validEmail.college.id;
    } else {
      throw new BadRequestException(
        'Não foi encontrado uma faculdade associada ao domínio do e-mail.',
      );
    }
  }

  async createProfile(
    createStudentProfileDto: CreateStudentProfileDto,
    req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    const { student, experiences, proficiencies } = createStudentProfileDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const existingCPF = await this.studentRepository.findOne({
      where: { cpf: student.cpf },
    });
    if (existingCPF) {
      throw new BadRequestException('CPF já cadastrado.');
    }

    if (user.type !== 'student') {
      throw new UnauthorizedException(
        'Apenas usuários do tipo estudante podem criar perfis de estudante.',
      );
    }

    const collegeId = await this.getCollegeIdByEmailDomain(user.email);

    const newStudent = await this.studentRepository.save({
      ...student,
      user,
      college: { id: collegeId },
    });

    if (experiences && experiences.length > 0) {
      const experiencesToSave = experiences.map((exp) => ({
        ...exp,
        student: newStudent,
      }));
      await this.experienceRepository.save(experiencesToSave);
    }

    if (proficiencies && proficiencies.length > 0) {
      const proficienciesToSave = proficiencies.map((tag) => ({
        student: newStudent,
        tag: { id: tag.id },
      }));
      await this.studentProficiencyRepository.save(proficienciesToSave);
    }

    user.status = 'complete';
    await this.userRepository.save(user);

    return newStudent;
  }

  async updateProfile(
    updateStudentProfileDto: UpdateStudentProfileDto,
    req: RequestWithUser,
  ) {
    const jwtUserId = req.user.userId;

    const student = await this.studentRepository.findOne({
      where: { user: { id: jwtUserId } },
      relations: ['user', 'college', 'experiences', 'proficiencies'],
    });

    const studentId = student.id;

    if (!student) {
      throw new NotFoundException('Perfil de estudante não encontrado.');
    }

    if (student.user.id !== jwtUserId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a atualizar este perfil.',
      );
    }

    const {
      student: studentData,
      experiences,
      proficiencies,
    } = updateStudentProfileDto;

    await this.studentRepository.update(studentId, studentData);

    await this.handleExperiences(studentId, experiences);
    await this.handleProficiencies(studentId, proficiencies);

    return await this.studentRepository.findOne({ where: { id: studentId } });
  }

  /* Handles */
  private async handleExperiences(studentId: number, experiences) {
    const existingExperiences = await this.experienceRepository.find({
      where: { student: { id: studentId } },
    });

    for (const exp of experiences) {
      if (exp.id) {
        await this.experienceRepository.update(exp.id, exp);
      } else {
        await this.experienceRepository.save({
          ...exp,
          student: { id: studentId },
        });
      }
    }

    const experienceIdsToKeep = experiences
      .map((exp) => exp.id)
      .filter((id) => !!id);
    const experiencesToDelete = existingExperiences.filter(
      (exp) => !experienceIdsToKeep.includes(exp.id),
    );

    if (experiencesToDelete.length > 0) {
      const idsToDelete = experiencesToDelete.map((exp) => exp.id);
      await this.experienceRepository.delete(idsToDelete);
    }
  }

  private async handleProficiencies(studentId: number, proficiencies) {
    const proficiencyIds = proficiencies.map((tag) => tag.id);

    const existingTags = await this.tagRepository.findByIds(proficiencyIds);
    if (existingTags.length !== proficiencyIds.length) {
      throw new BadRequestException(
        'Um ou mais IDs de tags fornecidos são inválidos.',
      );
    }

    const existingProficiencies = await this.studentProficiencyRepository.find({
      where: { student: { id: studentId } },
      relations: ['tag'],
    });

    const newProficiencies = proficiencies.filter((tag) => {
      if (!tag || !tag.id) {
        throw new BadRequestException(
          'Proficiencies devem conter IDs válidos.',
        );
      }
      return !existingProficiencies.some((prof) => prof.tag?.id === tag.id);
    });

    const newProficienciesToSave = newProficiencies.map((tag) => ({
      student: { id: studentId },
      tag: { id: tag.id },
    }));
    await this.studentProficiencyRepository.save(newProficienciesToSave);

    const proficienciesToDelete = existingProficiencies.filter((prof) => {
      if (!prof || !prof.tag) {
        throw new BadRequestException(
          'Proficiências existentes são inválidas.',
        );
      }
      return !proficiencyIds.includes(prof.tag.id);
    });

    if (proficienciesToDelete.length > 0) {
      await this.studentProficiencyRepository.remove(proficienciesToDelete);
    }
  }

  /* Experiences */
  async createExperience(createExperienceDto: CreateExperienceDto) {
    return await this.experienceRepository.save(createExperienceDto);
  }

  async getAllExperiences() {
    return this.experienceRepository.find({ relations: ['student'] });
  }

  async getExperienceById(id: number) {
    const experience = await this.experienceRepository.findOne({
      where: { id },
      relations: ['student'],
    });
    if (!experience) {
      throw new NotFoundException('Experiência não encontrada.');
    }
    return experience;
  }

  async updateExperience(id: number, updateExperienceDto: UpdateExperienceDto) {
    const experience = await this.experienceRepository.findOne({
      where: { id },
    });
    if (!experience) {
      throw new NotFoundException('Experiência não encontrada.');
    }
    await this.experienceRepository.update(id, updateExperienceDto);
    return this.experienceRepository.findOne({ where: { id } });
  }

  async deleteExperience(id: number) {
    const experience = await this.experienceRepository.findOne({
      where: { id },
    });
    if (!experience) {
      throw new NotFoundException('Experiência não encontrada.');
    }
    await this.experienceRepository.delete(id);
  }

  /* Favorite Jobs */

  async unfavoriteJob(jobPublicationId: number, req: RequestWithUser) {
    const userId = req.user.userId;

    const student = await this.studentRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!student) {
      throw new NotFoundException('Perfil de estudante não encontrado.');
    }

    const favoriteJob = await this.favoriteJobsRepository.findOne({
      where: {
        student: { id: student.id },
        jobPublication: { id: jobPublicationId },
      },
    });

    if (!favoriteJob) {
      throw new NotFoundException('Esta vaga não está nos favoritos.');
    }

    await this.favoriteJobsRepository.remove(favoriteJob);
  }

  async favoriteJob(jobPublicationId: number, req: RequestWithUser) {
    const userId = req.user.userId;

    const student = await this.studentRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!student) {
      throw new NotFoundException('Perfil de estudante não encontrado.');
    }

    const jobPublication = await this.jobPublicationRepository.findOne({
      where: { id: jobPublicationId },
    });

    if (!jobPublication) {
      throw new NotFoundException('Vaga não encontrada.');
    }

    const existingFavorite = await this.favoriteJobsRepository.findOne({
      where: {
        student: { id: student.id },
        jobPublication: { id: jobPublicationId },
      },
    });

    if (existingFavorite) {
      throw new Error('Esta vaga já está nos favoritos.');
    }

    const favoriteJob = this.favoriteJobsRepository.create({
      student,
      jobPublication,
    });

    return this.favoriteJobsRepository.save(favoriteJob);
  }

  async getFavoriteJobs(req: RequestWithUser) {
    const userId = req.user.userId;

    const student = await this.studentRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!student) {
      throw new NotFoundException('Perfil de estudante não encontrado.');
    }

    return this.favoriteJobsRepository.find({
      where: { student: { id: student.id } },
      relations: ['jobPublication'],
    });
  }
}
