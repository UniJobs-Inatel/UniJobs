import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
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

  @Get('student/:studentId')
  getTagsByStudentId(@Param('studentId') studentId: number) {
    return this.tagService.getTagsByStudentId(studentId);
  }

  @Get('job/:jobId')
  getTagsByJobId(@Param('jobId') jobId: number) {
    return this.tagService.getTagsByJobId(jobId);
  }

  /* --------------- StudentProficiency --------------- */
  @Post('student-proficiencies')
  createStudentProficiency(
    @Body('studentId') studentId: number,
    @Body('tagId') tagId: number,
  ) {
    return this.tagService.createStudentProficiency(studentId, tagId);
  }

  @Get('student-proficiencies/:studentId')
  getStudentProficiencies(@Param('studentId') studentId: number) {
    return this.tagService.getStudentProficiencies(studentId);
  }

  @Delete('student-proficiencies/:id')
  deleteStudentProficiency(@Param('id') id: number) {
    return this.tagService.deleteStudentProficiency(id);
  }

  /* --------------- JobTag --------------- */
  @Post('job-tags')
  createJobTag(@Body('jobId') jobId: number, @Body('tagId') tagId: number) {
    return this.tagService.createJobTag(jobId, tagId);
  }

  @Get('job-tags/:jobId')
  getJobTags(@Param('jobId') jobId: number) {
    return this.tagService.getJobTags(jobId);
  }

  @Delete('job-tags/:id')
  deleteJobTag(@Param('id') id: number) {
    return this.tagService.deleteJobTag(id);
  }
}
