import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
  };

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    type: 'student',
    status: 'active',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser as User);

      const result = await service.create({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toEqual(mockUser);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email is already in use', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      await expect(
        service.create({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error());

      await expect(
        service.create({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue([mockUser] as User[]);

      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(userRepository.find).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(userRepository, 'find').mockRejectedValue(new Error());

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error());

      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('newhashedpassword');
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...mockUser,
        password: 'newhashedpassword',
      } as User);

      const result = await service.update(1, { password: 'newpassword' });
      expect(result.password).toEqual('newhashedpassword');
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error());

      await expect(service.update(1, {})).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(mockUser as User);

      await service.remove(1);
      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error());

      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
