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
} from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /*--------------- Tags ---------------*/
  @Post()
  createTag(@Body() createTagDto: { name: string }) {
    if (!createTagDto.name || createTagDto.name.trim() === '') {
      throw new Error('Tag name cannot be empty');
    }
    return this.tagService.createTag(createTagDto.name);
  }

  @Get()
  getTags() {
    return this.tagService.getTags();
  }

  @Put(':id')
  updateTag(@Param('id') id: number, @Body('name') name: string) {
    return this.tagService.updateTag(id, name);
  }

  @Delete(':id')
  deleteTag(@Param('id') id: number) {
    return this.tagService.deleteTag(id);
  }

  /*--------------- Tagging Operations with JWT Validation ---------------*/
  @Get('student/:studentId')
  getTagsByStudentId(
    @Param('studentId') studentId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.tagService.getTagsByStudentId(studentId, req);
  }

  @Get('job/:jobId')
  getTagsByJobId(@Param('jobId') jobId: number, @Req() req: RequestWithUser) {
    return this.tagService.getTagsByJobId(jobId, req);
  }

  /* --------------- StudentProficiency --------------- */
  @Post('student-proficiencies')
  createStudentProficiency(
    @Body('studentId') studentId: number,
    @Body('tagId') tagId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.tagService.createStudentProficiency(studentId, tagId, req);
  }

  @Get('student-proficiencies/:studentId')
  getStudentProficiencies(
    @Param('studentId') studentId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.tagService.getStudentProficiencies(studentId, req);
  }

  @Delete('student-proficiencies/:id')
  deleteStudentProficiency(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.tagService.deleteStudentProficiency(id, req);
  }

  /* --------------- JobTag --------------- */
  @Post('job-tags')
  createJobTag(
    @Body('jobId') jobId: number,
    @Body('tagId') tagId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.tagService.createJobTag(jobId, tagId, req);
  }

  @Get('job-tags/:jobId')
  getJobTags(@Param('jobId') jobId: number, @Req() req: RequestWithUser) {
    return this.tagService.getJobTags(jobId, req);
  }

  @Delete('job-tags/:id')
  deleteJobTag(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.tagService.deleteJobTag(id, req);
  }
}
