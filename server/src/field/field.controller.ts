import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FieldService } from './field.service';
import { Field } from '../entities/field.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllFields(): Promise<Field[]> {
    return this.fieldService.getAllFields();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getFieldById(@Param('id', ParseIntPipe) id: number): Promise<Field> {
    return this.fieldService.getFieldById(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createField(@Body() createFieldDto: { field: string }): Promise<Field> {
    return this.fieldService.createField(createFieldDto);
  }
}
