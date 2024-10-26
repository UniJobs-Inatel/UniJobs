import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
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
  @HttpCode(HttpStatus.CREATED)
  async createCompanyProfile(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.companyService.createCompanyProfile(createCompanyDto, req);
  }

  @Get('profile/')
  @HttpCode(HttpStatus.OK)
  async getCompanyProfile(@Req() req: RequestWithUser) {
    return this.companyService.getCompanyProfile(req);
  }

  @Put('profile/')
  @HttpCode(HttpStatus.OK)
  async updateCompanyProfile(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.companyService.updateCompanyProfile(updateCompanyDto, req);
  }
}
