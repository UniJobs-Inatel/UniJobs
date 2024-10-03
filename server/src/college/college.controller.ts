import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college-dto';
import { CreateValidEmailDto } from './dto/create-valid-email-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('college')
@UseGuards(JwtAuthGuard)
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Post()
  async createCollege(
    @Body() createCollegeDto: CreateCollegeDto,
    @Req() req: RequestWithUser,
  ) {
    return this.collegeService.createCollege(createCollegeDto, req);
  }

  @Post('valid-email')
  async createValidEmail(
    @Body() createValidEmailDto: CreateValidEmailDto,
    @Req() req: RequestWithUser,
  ) {
    return this.collegeService.createValidEmail(createValidEmailDto, req);
  }

  @Delete('valid-email/:id')
  async deleteValidEmail(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.collegeService.deleteValidEmail(id, req);
  }

  @Get('valid-email/:college_id')
  async listValidEmails(
    @Param('college_id') college_id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.collegeService.listValidEmails(college_id, req);
  }

  @Get('valid-email/')
  async listAllValidEmails(@Req() req: RequestWithUser) {
    return this.collegeService.listAllValidEmails(req);
  }
}
