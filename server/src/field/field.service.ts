import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from '../entities/field.entity';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async getAllFields(): Promise<Field[]> {
    return this.fieldRepository.find();
  }

  async getFieldById(id: number): Promise<Field> {
    return this.fieldRepository.findOneBy({ id });
  }

  async createField(createFieldDto: { field: string }): Promise<Field> {
    const newField = this.fieldRepository.create(createFieldDto);
    return this.fieldRepository.save(newField);
  }

  async onModuleInit() {
    await this.populateFields();
  }

  async populateFields() {
    const predefinedFields = [
      'it',
      'engineering',
      'exact_sciences',
      'humanities',
      'business',
      'health',
      'arts',
      'agriculture',
      'law',
      'education',
    ];

    const existingFields = await this.fieldRepository.count();
    if (existingFields === 0) {
      const fieldEntities = predefinedFields.map((field) =>
        this.fieldRepository.create({ field }),
      );
      await this.fieldRepository.save(fieldEntities);
      console.log('Fields table populated with predefined values.');
    } else {
      console.log('Fields table already populated.');
    }
  }
}
