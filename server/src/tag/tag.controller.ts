  import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseGuards,
    Req,
    HttpCode,
    HttpStatus,
    BadRequestException,
  } from '@nestjs/common';
  import { TagService } from './tag.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { AdminGuard } from '../auth/admin.guard';
  import { RequestWithUser } from '../auth/request-with-user.interface';

  @Controller('tags')
  export class TagController {
    constructor(private readonly tagService: TagService) {}

    /*--------------- Tags (Admin Only) ---------------*/
    @UseGuards(AdminGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createTag(@Body() createTagDto: { name: string }) {
      if (!createTagDto.name || createTagDto.name.trim() === '') {
        throw new BadRequestException('Nome da tag não pode estar vazio.');
      }
      return this.tagService.createTag(createTagDto.name);
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateTag(@Param('id') id: number, @Body('name') name: string) {
      return this.tagService.updateTag(id, name);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTag(@Param('id') id: number) {
      await this.tagService.deleteTag(id);
    }

    /*--------------- Tagging Operations with JWT Validation (Authenticated Users) ---------------*/
    @UseGuards(JwtAuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    async getTags() {
      return this.tagService.getTags();
    }

    @UseGuards(JwtAuthGuard)
    @Get('student/:studentId')
    @HttpCode(HttpStatus.OK)
    async getTagsByStudentId(
      @Param('studentId') studentId: number,
      @Req() req: RequestWithUser,
    ) {
      return this.tagService.getTagsByStudentId(studentId, req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('job/:jobId')
    @HttpCode(HttpStatus.OK)
    async getTagsByJobId(
      @Param('jobId') jobId: number,
      @Req() req: RequestWithUser,
    ) {
      return this.tagService.getTagsByJobId(jobId, req);
    }

    /* --------------- StudentProficiency (JWT Required) --------------- */
    @UseGuards(JwtAuthGuard)
    @Post('student-proficiencies')
    @HttpCode(HttpStatus.CREATED)
    async createStudentProficiency(
      @Body('studentId') studentId: number,
      @Body('tagId') tagId: number,
      @Req() req: RequestWithUser,
    ) {
      return this.tagService.createStudentProficiency(studentId, tagId, req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('student-proficiencies/:studentId')
    @HttpCode(HttpStatus.OK)
    async getStudentProficiencies(
      @Param('studentId') studentId: number,
      @Req() req: RequestWithUser,
    ) {
      return this.tagService.getStudentProficiencies(studentId, req);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('student-proficiencies/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteStudentProficiency(
      @Param('id') id: number,
      @Req() req: RequestWithUser,
    ) {
      await this.tagService.deleteStudentProficiency(id, req);
    }

    /* --------------- JobTag (JWT Required) --------------- */
    @UseGuards(JwtAuthGuard)
    @Post('job-tags')
    @HttpCode(HttpStatus.CREATED)
    async createJobTag(
      @Body('jobId') jobId: number,
      @Body('tagId') tagId: number,
      @Req() req: RequestWithUser,
    ) {
      return this.tagService.createJobTag(jobId, tagId, req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('job-tags/:jobId')
    @HttpCode(HttpStatus.OK)
    async getJobTags(@Param('jobId') jobId: number, @Req() req: RequestWithUser) {
      return this.tagService.getJobTags(jobId, req);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('job-tags/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteJobTag(@Param('id') id: number, @Req() req: RequestWithUser) {
      await this.tagService.deleteJobTag(id, req);
    }
  }
