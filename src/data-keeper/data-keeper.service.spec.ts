import { Test, TestingModule } from '@nestjs/testing';
import { DataKeeperService } from './data-keeper.service';

describe('DataKeeperService', () => {
  let service: DataKeeperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataKeeperService],
    }).compile();

    service = module.get<DataKeeperService>(DataKeeperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
