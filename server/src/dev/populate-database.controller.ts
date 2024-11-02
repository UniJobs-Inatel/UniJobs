import { Controller, Get } from '@nestjs/common';
import { PopulateDatabaseService } from './populate-database.service';

@Controller('dev')
export class PopulateDatabaseController {
  constructor(
    private readonly populateDatabaseService: PopulateDatabaseService,
  ) {}

  @Get('devRoutePopulate-c121092u')
  async populateDatabase() {
    await this.populateDatabaseService.populateDatabase();
    return { message: 'Database populated successfully' };
  }
}
