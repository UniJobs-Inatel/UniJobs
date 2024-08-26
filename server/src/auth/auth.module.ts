import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { ValidEmail } from '../entities/valid-email.entity';
import { Verification } from '../entities/verification.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ValidEmail, Verification])],
  providers: [AuthService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
