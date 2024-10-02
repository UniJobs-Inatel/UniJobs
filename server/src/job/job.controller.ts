import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobPublicationDto } from './dto/create-job-publication.dto';
import { UpdateJobPublicationDto } from './dto/update-job-publication.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createJob(createJobDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllJobs() {
    return this.jobService.getAllJobs();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getJobById(@Param('id') id: number) {
    return this.jobService.getJobById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateJob(@Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.updateJob(id, updateJobDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteJob(@Param('id') id: number) {
    return this.jobService.deleteJob(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('publish')
  async publishJob(@Body() createJobPublicationDto: CreateJobPublicationDto) {
    return this.jobService.createJobPublication(createJobPublicationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('company/:companyId')
  async getJobsByCompany(@Param('companyId') companyId: number) {
    return this.jobService.getJobsByCompany(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('publications/company/:companyId')
  async getJobPublicationsByCompany(@Param('companyId') companyId: number) {
    return this.jobService.getJobPublicationsByCompany(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('publications/college/:collegeId')
  async getJobPublicationsByCollege(@Param('collegeId') collegeId: number) {
    return this.jobService.getJobPublicationsByCollege(collegeId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('publications/:id')
  async updateJobPublication(
    @Param('id') id: number,
    @Body() updateJobPublicationDto: UpdateJobPublicationDto,
  ) {
    return this.jobService.updateJobPublication(id, updateJobPublicationDto);
  }
}
