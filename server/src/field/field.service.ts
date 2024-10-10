import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    const field = await this.fieldRepository.findOneBy({ id });
    if (!field) {
      throw new NotFoundException('Área de atuação não encontrada.');
    }
    return field;
  }

  async createField(createFieldDto: { field: string }): Promise<Field> {
    const { field } = createFieldDto;

    if (!field || field.trim() === '') {
      throw new BadRequestException(
        'O nome da área de atuação não pode estar vazio.',
      );
    }

    const newField = this.fieldRepository.create({ field });
    return this.fieldRepository.save(newField);
  }

  async onModuleInit() {
    try {
      await this.populateFields();
    } catch (error) {
      console.error('Erro ao popular tabela de áreas de atuação:', error);
    }
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
      console.log(
        'Tabela de áreas de atuação populada com valores pré-definidos.',
      );
    } else {
      console.log('Tabela de áreas de atuação já está populada.');
    }
  }
}
