import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollegeService } from './college.service';
import { CollegeController } from './college.controller';
import { College } from '../entities/college.entity';
import { ValidEmail } from '../entities/valid-email.entity';
import { Company } from '../entities/company.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([College, ValidEmail, Company]),
    AuthModule,
  ],
  controllers: [CollegeController],
  providers: [CollegeService],
})
export class CollegeModule {}
