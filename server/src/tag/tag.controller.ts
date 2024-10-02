import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /*--------------- Tags ---------------*/
  @UseGuards(JwtAuthGuard)
  @Post()
  createTag(@Body() createTagDto: { name: string }) {
    if (!createTagDto.name || createTagDto.name.trim() === '') {
      throw new Error('Tag name cannot be empty');
    }
    return this.tagService.createTag(createTagDto.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getTags() {
    return this.tagService.getTags();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateTag(@Param('id') id: number, @Body('name') name: string) {
    return this.tagService.updateTag(id, name);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTag(@Param('id') id: number) {
    return this.tagService.deleteTag(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('student/:studentId')
  getTagsByStudentId(@Param('studentId') studentId: number) {
    return this.tagService.getTagsByStudentId(studentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('job/:jobId')
  getTagsByJobId(@Param('jobId') jobId: number) {
    return this.tagService.getTagsByJobId(jobId);
  }

  /* --------------- StudentProficiency --------------- */
  @UseGuards(JwtAuthGuard)
  @Post('student-proficiencies')
  createStudentProficiency(
    @Body('studentId') studentId: number,
    @Body('tagId') tagId: number,
  ) {
    return this.tagService.createStudentProficiency(studentId, tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('student-proficiencies/:studentId')
  getStudentProficiencies(@Param('studentId') studentId: number) {
    return this.tagService.getStudentProficiencies(studentId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('student-proficiencies/:id')
  deleteStudentProficiency(@Param('id') id: number) {
    return this.tagService.deleteStudentProficiency(id);
  }

  /* --------------- JobTag --------------- */
  @UseGuards(JwtAuthGuard)
  @Post('job-tags')
  createJobTag(@Body('jobId') jobId: number, @Body('tagId') tagId: number) {
    return this.tagService.createJobTag(jobId, tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('job-tags/:jobId')
  getJobTags(@Param('jobId') jobId: number) {
    return this.tagService.getJobTags(jobId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('job-tags/:id')
  deleteJobTag(@Param('id') id: number) {
    return this.tagService.deleteJobTag(id);
  }
}
