import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
  Post,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('type') type: string,
  ): Promise<{ message: string; verificationLink: string }> {
    return this.authService.register(email, password, type);
  }

  @Get('verify')
  async verifyAccount(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.authService.verifyAccount(code);
      res.redirect('http://localhost:4000/api');
    } catch (error) {
      if (error instanceof BadRequestException) {
        res.status(400).send('Invalid verification code');
      } else {
        throw error;
      }
    }
  }
}
