import {
  Controller,
  Get,
  Query,
  Res,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('type') type: string,
  ): Promise<{ message: string; verificationLink: string }> {
    if (!['student', 'college', 'company'].includes(type)) {
      throw new BadRequestException(
        'Invalid type. Expected one of: student, college, company.',
      );
    }

    return this.authService.register(
      email,
      password,
      type as 'student' | 'college' | 'company',
    );
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  async verifyAccount(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.authService.verifyAccount(code);
      res.redirect('https://main.d34x6e2xoqzvoz.amplifyapp.com/');
    } catch (error) {
      if (error instanceof BadRequestException) {
        res.status(400).send('Código de verificação inválido.');
      } else {
        throw error;
      }
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return this.authService.login(user);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
