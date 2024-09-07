import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('profile')
  async createCompanyProfile(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompanyProfile(createCompanyDto);
  }

  @Get('profile/:userId')
  async getCompanyProfile(@Param('userId') userId: number) {
    return this.companyService.getCompanyProfile(userId);
  }

  @Put('profile/:userId')
  async updateCompanyProfile(
    @Param('userId') userId: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.updateCompanyProfile(userId, updateCompanyDto);
  }
}
