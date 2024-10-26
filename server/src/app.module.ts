import { Module } from '@nestjs/common';
import { DevModule } from './dev/dev.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { CompanyModule } from './company/company.module';
import { CollegeModule } from './college/college.module';
import { StudentModule } from './student/student.module';
import { JobModule } from './job/job.module';
import { FieldModule } from './field/field.module';
import { DocsModule } from './docs/docs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    DevModule,
    TagModule,
    CompanyModule,
    CollegeModule,
    StudentModule,
    JobModule,
    FieldModule,
    DocsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
