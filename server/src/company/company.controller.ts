import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async createCompanyProfile(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompanyProfile(createCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:userId')
  async getCompanyProfile(@Param('userId') userId: number) {
    return this.companyService.getCompanyProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/:userId')
  async updateCompanyProfile(
    @Param('userId') userId: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.updateCompanyProfile(userId, updateCompanyDto);
  }
}
