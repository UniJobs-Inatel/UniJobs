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
  HttpCode,
  HttpStatus,
  Query,
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
  @HttpCode(HttpStatus.CREATED)
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.createJob(createJobDto, req);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllJobs() {
    return this.jobService.getAllJobs();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchJobs(
    @Query('location') location?: string,
    @Query('type') type?: string,
    @Query('skills') skills?: string,
    @Query('minSalary') minSalary?: number,
    @Query('maxSalary') maxSalary?: number,
    @Query('mode') mode?: string,
    @Query('weeklyHours') weeklyHours?: number,
    @Query('fieldId') fieldId?: number,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    const salaryRange =
      minSalary && maxSalary ? { min: minSalary, max: maxSalary } : undefined;
    const skillIds = skills ? skills.split(',').map(Number) : [];

    const filters = {
      location,
      type,
      skills: skillIds.length > 0 ? skillIds : undefined,
      salaryRange,
      mode,
      weeklyHours,
      fieldId,
    };

    const pagination = { limit, offset };

    return this.jobService.searchJobs(filters, pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getJobById(@Param('id') id: number) {
    return this.jobService.getJobById(id);
  }

  @Get('company/:companyId')
  @HttpCode(HttpStatus.OK)
  async getJobsByCompany(
    @Param('companyId') companyId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.getJobsByCompany(companyId, req);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateJob(
    @Param('id') id: number,
    @Body() updateJobDto: UpdateJobDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.updateJob(id, updateJobDto, req);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteJob(@Param('id') id: number, @Req() req: RequestWithUser) {
    await this.jobService.deleteJob(id, req);
  }

  @Post('publish')
  @HttpCode(HttpStatus.CREATED)
  async publishJob(
    @Body() createJobPublicationDto: CreateJobPublicationDto,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.createJobPublication(createJobPublicationDto, req);
  }

  @Get('publications/company/:companyId')
  @HttpCode(HttpStatus.OK)
  async getJobPublicationsByCompany(
    @Param('companyId') companyId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.getJobPublicationsByCompany(companyId, req);
  }

  @Get('publications/college/:collegeId')
  @HttpCode(HttpStatus.OK)
  async getJobPublicationsByCollege(
    @Param('collegeId') collegeId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.jobService.getJobPublicationsByCollege(collegeId, req);
  }

  @Get('publications/student')
  @HttpCode(HttpStatus.OK)
  async getJobPublicationsByUserCollege(@Req() req: RequestWithUser) {
    return this.jobService.getJobPublicationsByUserCollege(req);
  }

  @Put('publications/:id')
  @HttpCode(HttpStatus.OK)
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
