import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('type') type: string,
  ): Promise<void> {
    return this.authService.register(email, password, type);
  }

  @Post('verify')
  async verifyAccount(@Body('code') code: string): Promise<void> {
    return this.authService.verifyAccount(code);
  }
}
