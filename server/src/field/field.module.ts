import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { Field } from '../entities/field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Field])],
  controllers: [FieldController],
  providers: [FieldService],
})
export class FieldModule {}
