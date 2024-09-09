import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { User } from '../entities/user.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCompanyProfile(createCompanyDto: CreateCompanyDto) {
    const { user_id, ...companyData } = createCompanyDto;

    const existingCompany = await this.companyRepository.findOne({
      where: { user: { id: user_id } },
    });
    if (existingCompany) {
      throw new Error('User already has a company profile');
    }

    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.type !== 'company' && user.type !== 'college') {
      throw new Error(
        'Only users of type "company" or "college" can create a company profile',
      );
    }

    const company = this.companyRepository.create({ ...companyData, user });
    return this.companyRepository.save(company);
  }

  async getCompanyProfile(userId: number) {
    return this.companyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async updateCompanyProfile(
    userId: number,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!company) {
      throw new Error('Company profile not found');
    }

    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }
}
