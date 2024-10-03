import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobPublicationDto } from './dto/create-job-publication.dto';
import { UpdateJobPublicationDto } from './dto/update-job-publication.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('job')
@UseGuards(JwtAuthGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.createJob(createJobDto, req);
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
  async updateJob(
    @Param('id') id: number,
    @Body() updateJobDto: UpdateJobDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.updateJob(id, updateJobDto, req);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.jobService.deleteJob(id, req);
  }

  @Post('publish')
  async publishJob(
    @Body() createJobPublicationDto: CreateJobPublicationDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.createJobPublication(createJobPublicationDto, req);
  }

  @Get('company/:companyId')
  async getJobsByCompany(
    @Param('companyId') companyId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.getJobsByCompany(companyId, req);
  }

  @Get('publications/company/:companyId')
  async getJobPublicationsByCompany(
    @Param('companyId') companyId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.getJobPublicationsByCompany(companyId, req);
  }

  @Get('publications/college/:collegeId')
  async getJobPublicationsByCollege(
    @Param('collegeId') collegeId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.getJobPublicationsByCollege(collegeId, req);
  }

  @Put('publications/:id')
  async updateJobPublication(
    @Param('id') id: number,
    @Body() updateJobPublicationDto: UpdateJobPublicationDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.updateJobPublication(
      id,
      updateJobPublicationDto,
      req,
    );
  }
}
