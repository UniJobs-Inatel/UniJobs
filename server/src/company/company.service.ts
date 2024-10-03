import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from '../entities/user.entity';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCompanyProfile(
    createCompanyDto: CreateCompanyDto,
    req: RequestWithUser,
  ) {
    const userId = req.user.userId;

    const existingCompany = await this.companyRepository.findOne({
      where: { user: { id: userId } },
    });
    if (existingCompany) {
      throw new Error('User already has a company profile');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.type !== 'company' && user.type !== 'college') {
      throw new Error(
        'Only users of type "company" or "college" can create a company profile',
      );
    }

    const company = this.companyRepository.create({
      ...createCompanyDto,
      user,
    });
    return this.companyRepository.save(company);
  }

  async getCompanyProfile(userId: number, req: RequestWithUser) {
    const jwtUserId = req.user.userId;
    if (jwtUserId !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a realizar esta ação',
      );
    }

    return this.companyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async updateCompanyProfile(
    userId: number,
    updateCompanyDto: UpdateCompanyDto,
    req: RequestWithUser,
  ) {
    const jwtUserId = req.user.userId;
    if (jwtUserId !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a realizar esta ação',
      );
    }

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
