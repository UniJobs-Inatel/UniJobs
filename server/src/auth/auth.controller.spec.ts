import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    verifyAccount: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
    refreshAccessToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return a verification link', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const type = 'user';
      const result = {
        message: 'User registered successfully.',
        verificationLink: 'http://example.com/verify?code=12345',
      };
      
      mockAuthService.register.mockResolvedValue(result);

      expect(await controller.register(email, password, type)).toEqual(result);
      expect(service.register).toHaveBeenCalledWith(email, password, type);
    });
  });

  describe('verifyAccount', () => {
    it('should verify account and redirect to the specified URL', async () => {
      const code = '12345';
      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.verifyAccount(code, res);
      expect(service.verifyAccount).toHaveBeenCalledWith(code);
      expect(res.redirect).toHaveBeenCalledWith('http://localhost:4000/api');
    });

    it('should return 400 status if the code is invalid', async () => {
      const code = 'invalid';
      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      mockAuthService.verifyAccount.mockRejectedValue(new BadRequestException());

      await controller.verifyAccount(code, res);
      expect(service.verifyAccount).toHaveBeenCalledWith(code);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Código de verificação inválido.');
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens on successful login', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { id: 1, email };
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(tokens);

      expect(await controller.login(email, password)).toEqual(tokens);
      expect(service.validateUser).toHaveBeenCalledWith(email, password);
      expect(service.login).toHaveBeenCalledWith(user);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrong-password';

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas.'),
      );
      expect(service.validateUser).toHaveBeenCalledWith(email, password);
    });
  });

  describe('refreshToken', () => {
    it('should return new access and refresh tokens', async () => {
      const refreshToken = 'old-refresh-token';
      const tokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refreshAccessToken.mockResolvedValue(tokens);

      expect(await controller.refreshToken(refreshToken)).toEqual(tokens);
      expect(service.refreshAccessToken).toHaveBeenCalledWith(refreshToken);
    });
  });
});
