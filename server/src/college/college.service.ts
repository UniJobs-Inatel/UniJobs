import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { College } from '../entities/college.entity';
import { ValidEmail } from '../entities/valid-email.entity';
import { CreateCollegeDto } from './dto/create-college-dto';
import { CreateValidEmailDto } from './dto/create-valid-email-dto';
import { Company } from '../entities/company.entity';
import { RequestWithUser } from '../auth/request-with-user.interface';

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

  async createCollege(
    createCollegeDto: CreateCollegeDto,
    req: RequestWithUser,
  ) {
    const { company_id } = createCollegeDto;
    const userId = req.user.userId;

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

    if (company.user.id !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a realizar esta ação',
      );
    }

    const college = this.collegeRepository.create({ company });
    return this.collegeRepository.save(college);
  }

  async createValidEmail(
    createValidEmailDto: CreateValidEmailDto,
    req: RequestWithUser,
  ) {
    const { domain, college_id } = createValidEmailDto;
    const userId = req.user.userId;

    const college = await this.collegeRepository.findOne({
      where: { id: college_id },
      relations: ['company'],
    });
    if (!college) {
      throw new Error('College not found');
    }

    const company = await this.companyRepository.findOne({
      where: { id: college.company.id },
      relations: ['user'],
    });

    if (company.user.id !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a realizar esta ação',
      );
    }

    const validEmail = this.validEmailRepository.create({ domain, college });
    return this.validEmailRepository.save(validEmail);
  }

  async deleteValidEmail(id: number, req: RequestWithUser) {
    const userId = req.user.userId;

    const validEmail = await this.validEmailRepository.findOne({
      where: { id },
      relations: ['college'],
    });
    if (!validEmail) {
      throw new Error('Valid email not found');
    }

    const company = await this.companyRepository.findOne({
      where: { id: validEmail.college.company.id },
      relations: ['user'],
    });

    if (company.user.id !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a realizar esta ação',
      );
    }

    return this.validEmailRepository.delete(id);
  }

  async listValidEmails(college_id: number, req: RequestWithUser) {
    const userId = req.user.userId;

    const college = await this.collegeRepository.findOne({
      where: { id: college_id },
      relations: ['company'],
    });
    if (!college) {
      throw new Error('College not found');
    }

    const company = await this.companyRepository.findOne({
      where: { id: college.company.id },
      relations: ['user'],
    });

    if (company.user.id !== userId) {
      throw new UnauthorizedException(
        'Usuário não autorizado a realizar esta ação',
      );
    }

    return this.validEmailRepository.find({
      where: { college: { id: college_id } },
    });
  }

  async listAllValidEmails(req: RequestWithUser) {
    const userId = req.user.userId;

    const userColleges = await this.collegeRepository.find({
      where: { company: { user: { id: userId } } },
    });

    if (userColleges.length === 0) {
      throw new UnauthorizedException('Usuário não autorizado a visualizar');
    }

    return this.validEmailRepository.find();
  }
}
