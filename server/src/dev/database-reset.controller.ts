import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DatabaseResetService } from './database-reset.service';

@Controller('dev')
export class DatabaseResetController {
  constructor(private readonly databaseResetService: DatabaseResetService) {}

  @Get('devRouteDatabaseReset-c121092u')
  async resetDatabase(@Res() res: Response): Promise<void> {
    await this.databaseResetService.resetDatabase();
    res.redirect('http://localhost:4000/api/');
  }
}
