import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { FieldService } from './field.service';
import { Field } from '../entities/field.entity';

@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Get()
  async getAllFields(): Promise<Field[]> {
    return this.fieldService.getAllFields();
  }

  @Get(':id')
  async getFieldById(@Param('id', ParseIntPipe) id: number): Promise<Field> {
    return this.fieldService.getFieldById(id);
  }

  @Post()
  async createField(@Body() createFieldDto: { field: string }): Promise<Field> {
    return this.fieldService.createField(createFieldDto);
  }
}
