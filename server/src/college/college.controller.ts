import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college-dto';
import { CreateValidEmailDto } from './dto/create-valid-email-dto';

@Controller('college')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Post()
  async createCollege(@Body() createCollegeDto: CreateCollegeDto) {
    return this.collegeService.createCollege(createCollegeDto);
  }

  @Post('valid-email')
  async createValidEmail(@Body() createValidEmailDto: CreateValidEmailDto) {
    return this.collegeService.createValidEmail(createValidEmailDto);
  }

  @Delete('valid-email/:id')
  async deleteValidEmail(@Param('id') id: number) {
    return this.collegeService.deleteValidEmail(id);
  }

  @Get('valid-email/:college_id')
  async listValidEmails(@Param('college_id') college_id: number) {
    return this.collegeService.listValidEmails(college_id);
  }

  @Get('valid-email/')
  async listAllValidEmails() {
    return this.collegeService.listAllValidEmails();
  }
}
