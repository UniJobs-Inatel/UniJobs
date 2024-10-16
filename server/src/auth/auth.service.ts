import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { Verification } from '../entities/verification.entity';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    type: string,
  ): Promise<{ message: string; verificationLink: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('E-mail já registrado.');
    }

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

    const verificationUrl = `http://localhost:4000/api/auth/verify?code=${verificationCode}`;

    await this.mailService.sendVerificationEmail(user.email, verificationUrl);

    return {
      message: 'Usuário criado com sucesso. Verifique seu e-mail.',
      verificationLink: verificationUrl,
    };
  }

  async verifyAccount(verificationCode: string): Promise<void> {
    const verification = await this.verificationRepository.findOne({
      where: { verificationCode },
      relations: ['user'],
    });

    if (!verification) {
      throw new BadRequestException('Código de verificação inválido.');
    }

    const user = verification.user;
    user.status = 'confirmed';
    await this.userRepository.save(user);

    await this.verificationRepository.remove(verification);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Removendo esse lint para essa linha para poder remover password do usuário antes do return
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    user: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (user.status === 'created') {
      throw new BadRequestException(
        'É necessário validar o usuário antes de realizar login.',
      );
    }
    const payload = {
      email: user.email,
      sub: user.id,
      type: user.type,
      status: user.status,
    };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15min' }),
      refreshToken: this.generateRefreshToken(user.id),
    };
  }

  generateRefreshToken(userId: number): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      if (!payload.sub) {
        throw new UnauthorizedException(
          'Token inválido: ID de usuário não encontrado no payload.',
        );
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Token de atualização inválido.');
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException(
        'Erro ao validar o token de atualização.',
      );
    }
  }
}
