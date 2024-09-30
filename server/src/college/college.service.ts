import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { College } from '../entities/college.entity';
import { ValidEmail } from '../entities/valid-email.entity';
import { CreateCollegeDto } from './dto/create-college-dto';
import { CreateValidEmailDto } from './dto/create-valid-email-dto';
import { Company } from '../entities/company.entity';

@Injectable()
export class CollegeService {
  constructor(
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
    @InjectRepository(ValidEmail)
    private readonly validEmailRepository: Repository<ValidEmail>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async createCollege(createCollegeDto: CreateCollegeDto) {
    const { company_id } = createCollegeDto;

    const company = await this.companyRepository.findOne({
      where: { id: company_id },
      relations: ['user'],
    });

    if (!company) {
      throw new Error('Company not found');
    }

    if (company.user.type !== 'college') {
      throw new Error(
        'The user associated with this company must be of type "college".',
      );
    }

    const college = this.collegeRepository.create({ company });
    return this.collegeRepository.save(college);
  }

  async createValidEmail(createValidEmailDto: CreateValidEmailDto) {
    const { domain, college_id } = createValidEmailDto;

    const college = await this.collegeRepository.findOne({
      where: { id: college_id },
    });
    if (!college) {
      throw new Error('College not found');
    }

    const validEmail = this.validEmailRepository.create({ domain, college });
    return this.validEmailRepository.save(validEmail);
  }

  async deleteValidEmail(id: number) {
    return this.validEmailRepository.delete(id);
  }

  async listValidEmails(college_id: number) {
    return this.validEmailRepository.find({
      where: { college: { id: college_id } },
    });
  }

  async listAllValidEmails() {
    return this.validEmailRepository.find();
  }
}
