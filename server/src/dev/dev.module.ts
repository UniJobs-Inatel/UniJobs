import { Module } from '@nestjs/common';
import { DatabaseResetController } from './database-reset.controller';
import { DatabaseResetService } from './database-reset.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [DatabaseResetController],
  providers: [DatabaseResetService],
})
export class DevModule {}
