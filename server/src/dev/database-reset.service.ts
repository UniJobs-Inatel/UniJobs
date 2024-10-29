import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseResetService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async resetDatabase(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const tables = [
      'user',
      'student',
      'experience',
      'company',
      'college',
      'valid_email',
      'course',
      'job',
      'service',
      'job_publication',
      'favorite_jobs',
      'verification',
      'tag',
      'student_proficiency',
      'job_tag',
    ];

    try {
      await queryRunner.query(`SET session_replication_role = 'replica';`);

      for (const table of tables) {
        const result = await queryRunner.query(
          `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${table}');`,
        );

        if (result[0]?.exists) {
          console.log(`Truncating table: ${table}`);
          await queryRunner.query(`TRUNCATE TABLE "${table}" CASCADE;`);
        } else {
          console.warn(`Table ${table} does not exist, skipping...`);
        }
      }

      await queryRunner.query(`SET session_replication_role = 'origin';`);
    } catch (error) {
      console.error('Error resetting database:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
