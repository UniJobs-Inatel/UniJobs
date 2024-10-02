import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college-dto';
import { CreateValidEmailDto } from './dto/create-valid-email-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('college')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCollege(@Body() createCollegeDto: CreateCollegeDto) {
    return this.collegeService.createCollege(createCollegeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('valid-email')
  async createValidEmail(@Body() createValidEmailDto: CreateValidEmailDto) {
    return this.collegeService.createValidEmail(createValidEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('valid-email/:id')
  async deleteValidEmail(@Param('id') id: number) {
    return this.collegeService.deleteValidEmail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('valid-email/:college_id')
  async listValidEmails(@Param('college_id') college_id: number) {
    return this.collegeService.listValidEmails(college_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('valid-email/')
  async listAllValidEmails() {
    return this.collegeService.listAllValidEmails();
  }
}
