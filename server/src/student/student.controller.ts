import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  CreateStudentProfileDto,
  UpdateStudentProfileDto,
  CreateExperienceDto,
  UpdateExperienceDto,
} from './dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('profile')
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @Body() createStudentProfileDto: CreateStudentProfileDto,
  ) {
    const userId = createStudentProfileDto.userId;
    return this.studentService.createProfile(createStudentProfileDto, userId);
  }

  @Put('profile/:id')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentProfileDto: UpdateStudentProfileDto,
  ) {
    return this.studentService.updateProfile(id, updateStudentProfileDto);
  }

  @Post('experience')
  @HttpCode(HttpStatus.CREATED)
  async createExperience(@Body() createExperienceDto: CreateExperienceDto) {
    return this.studentService.createExperience(createExperienceDto);
  }

  @Get('experience')
  async getAllExperiences() {
    return this.studentService.getAllExperiences();
  }

  @Get('experience/:id')
  async getExperienceById(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.getExperienceById(id);
  }

  @Put('experience/:id')
  async updateExperience(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.studentService.updateExperience(id, updateExperienceDto);
  }

  @Delete('experience/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteExperience(@Param('id', ParseIntPipe) id: number) {
    await this.studentService.deleteExperience(id);
  }
}
