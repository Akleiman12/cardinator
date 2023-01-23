import { BadRequestException, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { DataKeeperService } from '../data-keeper/data-keeper.service';
import { UserRegisterDTO } from './models/user-register.dto';
import { UserService } from './user.service';
import { CardService } from '../card/card.service';
import { Observable, of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let mockDataKeeperService: DataKeeperService;
  let mockJwtService: JwtService;
  let uncompiledModule: TestingModuleBuilder;
  let module: TestingModule;

  beforeAll(async () => {
    uncompiledModule = await Test.createTestingModule({
      providers: [
        UserService, 
        {
          provide: DataKeeperService,
          useValue: {
            getData: jest.fn(() => []),
            setData: jest.fn(() => {})
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => {}),
          }
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() => of({ data: { result: [] } })),
          }
        },
        {
          provide: CardService,
          useValue: {
            create: jest.fn(() => {}),
          }
        }
      ],
    })

  });

  describe('Base', () => {
    beforeEach(async () => {
      module = await uncompiledModule.compile();
      
      service = module.get<UserService>(UserService);
      mockDataKeeperService = module.get<DataKeeperService>(DataKeeperService);
      mockJwtService = module.get<JwtService>(JwtService);
    })

    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  })

  describe('Happy Path', () => {
    beforeEach(async () => {
      module = await uncompiledModule.compile();
      
      service = module.get<UserService>(UserService);
      mockDataKeeperService = module.get<DataKeeperService>(DataKeeperService);
      mockJwtService = module.get<JwtService>(JwtService);
    })

    it('should register user in usersList', async () => {
      const input: UserRegisterDTO = {
        username: 'abcdefg',
        password: '12345678',
        wallet: '0x0000000000000000000000000000000000000000',
        balance: 0
      };

      await service.register(input);

      expect(service.usersList[0]).toBeDefined();
      expect(service.usersList[0]).toMatchObject(input);
      expect(service.usersList[0]).toHaveProperty('id');
      expect(service.usersList[0]).toHaveProperty('createdAt');
    })
  })

  describe('Error Path:', () => {
    beforeEach(async () => {
      module = await uncompiledModule.compile();
      
      service = module.get<UserService>(UserService);
      mockDataKeeperService = module.get<DataKeeperService>(DataKeeperService);
      mockJwtService = module.get<JwtService>(JwtService);
    })

    it('should fail to register user with non-unique username', async () => {
      let error;
      let errorMessage: string;
      let errorStatus: number;
      const nonUniqueUsername = 'nonuniqueusername';
      const input1: UserRegisterDTO = {
        username: nonUniqueUsername,
        password: '12345678',
        wallet: '0x0000000000000000000000000000000000000000',
        balance: 0
      };

      const input2: UserRegisterDTO = {
        username: nonUniqueUsername,
        password: '12345678',
        wallet: '0x0000000000000000000000000000000000000001',
        balance: 0
      };

      service.register(input1);

      try {
        await service.register(input2);
      } catch(err) {
        error = err.getResponse();
        errorStatus = error.statusCode;
        errorMessage = error.message;
      }

      expect(error).toBeDefined();
      expect(errorStatus).toBe(400);
      expect(errorMessage).toBe('Username already exists.');
    })
  })

});
