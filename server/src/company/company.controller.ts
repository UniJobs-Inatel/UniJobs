import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('profile')
  async createCompanyProfile(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.companyService.createCompanyProfile(createCompanyDto, req);
  }

  @Get('profile/:userId')
  async getCompanyProfile(
    @Param('userId') userId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.companyService.getCompanyProfile(userId, req);
  }

  @Put('profile/:userId')
  async updateCompanyProfile(
    @Param('userId') userId: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.companyService.updateCompanyProfile(
      userId,
      updateCompanyDto,
      req,
    );
  }
}
