import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobPublicationDto } from './dto/create-job-publication.dto';
import { UpdateJobPublicationDto } from './dto/update-job-publication.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createJob(createJobDto);
  }

  @Get()
  async getAllJobs() {
    return this.jobService.getAllJobs();
  }

  @Get(':id')
  async getJobById(@Param('id') id: number) {
    return this.jobService.getJobById(id);
  }

  @Put(':id')
  async updateJob(@Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.updateJob(id, updateJobDto);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: number) {
    return this.jobService.deleteJob(id);
  }

  @Post('publish')
  async publishJob(@Body() createJobPublicationDto: CreateJobPublicationDto) {
    return this.jobService.createJobPublication(createJobPublicationDto);
  }

  @Get('company/:companyId')
  async getJobsByCompany(@Param('companyId') companyId: number) {
    return this.jobService.getJobsByCompany(companyId);
  }

  @Get('publications/company/:companyId')
  async getJobPublicationsByCompany(@Param('companyId') companyId: number) {
    return this.jobService.getJobPublicationsByCompany(companyId);
  }

  @Get('publications/college/:collegeId')
  async getJobPublicationsByCollege(@Param('collegeId') collegeId: number) {
    return this.jobService.getJobPublicationsByCollege(collegeId);
  }

  @Put('publications/:id')
  async updateJobPublication(
    @Param('id') id: number,
    @Body() updateJobPublicationDto: UpdateJobPublicationDto,
  ) {
    return this.jobService.updateJobPublication(id, updateJobPublicationDto);
  }
}
