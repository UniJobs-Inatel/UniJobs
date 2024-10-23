import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
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
      throw new ConflictException('O usuário já possui um perfil de empresa.');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user.type !== 'company' && user.type !== 'college') {
      throw new UnauthorizedException(
        'Apenas usuários do tipo "empresa" ou "faculdade" podem criar um perfil de empresa.',
      );
    }

    const company = this.companyRepository.create({
      ...createCompanyDto,
      user,
    });
    return this.companyRepository.save(company);
  }

  async getCompanyProfile(req: RequestWithUser) {
    const userId = req.user.userId;

    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!company) {
      throw new NotFoundException('Perfil de empresa não encontrado.');
    }

    return company;
  }

  async updateCompanyProfile(
    updateCompanyDto: UpdateCompanyDto,
    req: RequestWithUser,
  ) {
    const userId = req.user.userId;

    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!company) {
      throw new NotFoundException('Perfil de empresa não encontrado.');
    }

    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }
}
