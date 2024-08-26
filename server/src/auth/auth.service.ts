import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { Verification } from '../entities/verification.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
    private mailService: MailService,
  ) {}

  async register(email: string, password: string, type: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      status: 'created',
      type,
    });
    await this.userRepository.save(user);

    const verificationCode = uuidv4();
    const verification = this.verificationRepository.create({
      verificationCode,
      user,
    });
    await this.verificationRepository.save(verification);

    const verificationUrl = `https://puginarug.com/verify?code=${verificationCode}`;
    await this.mailService.sendVerificationEmail(user.email, verificationUrl);
  }

  async verifyAccount(verificationCode: string): Promise<void> {
    const verification = await this.verificationRepository.findOne({
      where: { verificationCode },
      relations: ['user'],
    });

    if (!verification) {
      throw new BadRequestException('Invalid verification code.');
    }

    const user = verification.user;
    user.status = 'confirmed';
    await this.userRepository.save(user);

    await this.verificationRepository.remove(verification);
  }
}
