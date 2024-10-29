import { Module } from '@nestjs/common';
import { DatabaseResetController } from './database-reset.controller';
import { DatabaseResetService } from './database-reset.service';
import { PopulateDatabaseController } from './populate-database.controller';
import { PopulateDatabaseService } from './populate-database.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [DatabaseResetController, PopulateDatabaseController],
  providers: [DatabaseResetService, PopulateDatabaseService],
})
export class DevModule {}
