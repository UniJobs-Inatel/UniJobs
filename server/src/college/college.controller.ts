import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto, CreateValidEmailDto } from './dto';

@Controller('college')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  // Create a college
  @Post()
  async createCollege(@Body() createCollegeDto: CreateCollegeDto) {
    return this.collegeService.createCollege(createCollegeDto);
  }

  // Create a valid email domain
  @Post('valid-email')
  async createValidEmail(@Body() createValidEmailDto: CreateValidEmailDto) {
    return this.collegeService.createValidEmail(createValidEmailDto);
  }

  // Delete a valid email domain
  @Delete('valid-email/:id')
  async deleteValidEmail(@Param('id') id: number) {
    return this.collegeService.deleteValidEmail(id);
  }

  // List valid email domains for a college
  @Get('valid-email/:college_id')
  async listValidEmails(@Param('college_id') college_id: number) {
    return this.collegeService.listValidEmails(college_id);
  }

  @Get('valid-email/')
  async listAllValidEmails() {
    return this.collegeService.listAllValidEmails();
  }
}
