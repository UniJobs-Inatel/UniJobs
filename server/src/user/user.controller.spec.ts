import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@example.com',
    type: 'student',
    status: 'created',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      jest.spyOn(service, 'findAll').mockResolvedValue(users as User[]);

      const result = await controller.findAll();
      expect(result).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as User);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockUser as User);

      const createUserDto = {
        email: 'newuser@example.com',
        type: 'student' as const,
      };
      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDto = { email: 'updateduser@example.com' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(service, 'update').mockResolvedValue(updatedUser as User);

      const result = await controller.update(1, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
