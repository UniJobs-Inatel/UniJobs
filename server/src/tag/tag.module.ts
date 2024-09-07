import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from '../entities/tag.entity';
import { StudentProficiency } from '../entities/student-proficiency.entity';
import { JobTag } from '../entities/job-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, StudentProficiency, JobTag])],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
