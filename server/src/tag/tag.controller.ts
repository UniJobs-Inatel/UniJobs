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
import { AdminGuard } from '../auth/admin.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /*--------------- Tags (Admin Only) ---------------*/
  @UseGuards(AdminGuard)
  @Post()
  createTag(@Body() createTagDto: { name: string }) {
    if (!createTagDto.name || createTagDto.name.trim() === '') {
      throw new Error('Tag name cannot be empty');
    }
    return this.tagService.createTag(createTagDto.name);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  updateTag(@Param('id') id: number, @Body('name') name: string) {
    return this.tagService.updateTag(id, name);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteTag(@Param('id') id: number) {
    return this.tagService.deleteTag(id);
  }

  /*--------------- Tagging Operations with JWT Validation (Authenticated Users) ---------------*/
  @UseGuards(JwtAuthGuard)
  @Get()
  getTags() {
    return this.tagService.getTags();
  }

  @UseGuards(JwtAuthGuard)
  @Get('student/:studentId')
  getTagsByStudentId(
    @Param('studentId') studentId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.tagService.getTagsByStudentId(studentId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('job/:jobId')
  getTagsByJobId(@Param('jobId') jobId: number, @Req() req: RequestWithUser) {
    return this.tagService.getTagsByJobId(jobId, req);
  }

  /* --------------- StudentProficiency (JWT Required) --------------- */
  @UseGuards(JwtAuthGuard)
  @Post('student-proficiencies')
  createStudentProficiency(
    @Body('studentId') studentId: number,
    @Body('tagId') tagId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.tagService.createStudentProficiency(studentId, tagId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('student-proficiencies/:studentId')
  getStudentProficiencies(
    @Param('studentId') studentId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.tagService.getStudentProficiencies(studentId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('student-proficiencies/:id')
  deleteStudentProficiency(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.tagService.deleteStudentProficiency(id, req);
  }

  /* --------------- JobTag (JWT Required) --------------- */
  @UseGuards(JwtAuthGuard)
  @Post('job-tags')
  createJobTag(
    @Body('jobId') jobId: number,
    @Body('tagId') tagId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.tagService.createJobTag(jobId, tagId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('job-tags/:jobId')
  getJobTags(@Param('jobId') jobId: number, @Req() req: RequestWithUser) {
    return this.tagService.getJobTags(jobId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('job-tags/:id')
  deleteJobTag(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.tagService.deleteJobTag(id, req);
  }
}
