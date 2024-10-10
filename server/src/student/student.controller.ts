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
  UseGuards,
  Req,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('student')
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('profile')
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @Body() createStudentProfileDto: CreateStudentProfileDto,
    @Req() req: RequestWithUser,
  ) {
    return this.studentService.createProfile(createStudentProfileDto, req);
  }

  @Put('profile/:id')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentProfileDto: UpdateStudentProfileDto,
    @Req() req: RequestWithUser,
  ) {
    return this.studentService.updateProfile(id, updateStudentProfileDto, req);
  }

  @Get('profile/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getProfileByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.studentService.getProfileByUserId(userId, req);
  }

  @Post('experience')
  @HttpCode(HttpStatus.CREATED)
  async createExperience(@Body() createExperienceDto: CreateExperienceDto) {
    return this.studentService.createExperience(createExperienceDto);
  }

  @Get('experience')
  @HttpCode(HttpStatus.OK)
  async getAllExperiences() {
    return this.studentService.getAllExperiences();
  }

  @Get('experience/:id')
  @HttpCode(HttpStatus.OK)
  async getExperienceById(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.getExperienceById(id);
  }

  @Put('experience/:id')
  @HttpCode(HttpStatus.OK)
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

  @Get('favorite-jobs')
  @HttpCode(HttpStatus.OK)
  async getFavoriteJobs(@Req() req: RequestWithUser) {
    return this.studentService.getFavoriteJobs(req.user.userId, req);
  }

  @Post('favorite-job/:jobId')
  @HttpCode(HttpStatus.CREATED)
  async favoriteJob(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.studentService.favoriteJob(jobId, req);
  }

  @Delete('favorite-job/:jobId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfavoriteJob(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Req() req: RequestWithUser,
  ) {
    await this.studentService.unfavoriteJob(jobId, req);
  }
}
