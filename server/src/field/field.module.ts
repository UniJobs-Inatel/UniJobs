import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { Field } from '../entities/field.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), AuthModule],
  controllers: [FieldController],
  providers: [FieldService],
})
export class FieldModule {}
