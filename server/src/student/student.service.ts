import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { Experience } from '../entities/experience.entity';
import { StudentProficiency } from '../entities/student-proficiency.entity';
import { ValidEmail } from '../entities/valid-email.entity';
import { College } from '../entities/college.entity';
import { User } from '../entities/user.entity';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    @InjectRepository(StudentProficiency)
    private readonly studentProficiencyRepository: Repository<StudentProficiency>,
    @InjectRepository(ValidEmail)
    private readonly validEmailRepository: Repository<ValidEmail>,
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfileByUserId(userId: number) {
    const student = await this.studentRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'college', 'experiences', 'proficiencies'],
    });
    if (!student) {
      throw new Error('Student profile not found for this user.');
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
      return 1;
    }
  }

  async createProfile(
    createStudentProfileDto: CreateStudentProfileDto,
    userId: number,
  ) {
    const { student, experiences, proficiencies } = createStudentProfileDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
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

    return newStudent;
  }

  async updateProfile(
    id: number,
    updateStudentProfileDto: UpdateStudentProfileDto,
  ) {
    const { student, experiences, proficiencies } = updateStudentProfileDto;

    await this.studentRepository.update(id, student);

    await this.handleExperiences(id, experiences);
    await this.handleProficiencies(id, proficiencies);

    return await this.studentRepository.findOne({ where: { id } });
  }

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
    const existingProficiencies = await this.studentProficiencyRepository.find({
      where: { student: { id: studentId } },
    });

    const proficiencyIdsToKeep = proficiencies.map((tag) => tag.id);
    const newProficiencies = proficiencies.filter(
      (tag) => !existingProficiencies.some((prof) => prof.tag.id === tag.id),
    );
    const newProficienciesToSave = newProficiencies.map((tag) => ({
      student: { id: studentId },
      tag: { id: tag.id },
    }));
    await this.studentProficiencyRepository.save(newProficienciesToSave);

    const proficienciesToDelete = existingProficiencies.filter(
      (prof) => !proficiencyIdsToKeep.includes(prof.tag.id),
    );
    if (proficienciesToDelete.length > 0) {
      await this.studentProficiencyRepository.remove(proficienciesToDelete);
    }
  }

  async createExperience(createExperienceDto: CreateExperienceDto) {
    const experience =
      await this.experienceRepository.save(createExperienceDto);
    return experience;
  }

  async getAllExperiences() {
    return this.experienceRepository.find({ relations: ['student'] });
  }

  async getExperienceById(id: number) {
    return this.experienceRepository.findOne({
      where: { id },
      relations: ['student'],
    });
  }

  async updateExperience(id: number, updateExperienceDto: UpdateExperienceDto) {
    await this.experienceRepository.update(id, updateExperienceDto);
    return this.experienceRepository.findOne({ where: { id } });
  }

  async deleteExperience(id: number) {
    await this.experienceRepository.delete(id);
  }
}
