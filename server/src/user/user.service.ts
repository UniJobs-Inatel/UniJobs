import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new ConflictException('O email já está registrado.');
      }

      if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
      }

      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar o usuário.');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar os usuários.');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar o usuário.');
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    try {
      const user = await this.findOne(id);
      if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
      }

      const updatedUser = this.userRepository.merge(user, userData);
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar o usuário.');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover o usuário.');
    }
  }
}
