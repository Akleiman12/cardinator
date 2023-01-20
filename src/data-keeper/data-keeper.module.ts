import { Module } from '@nestjs/common';
import { DataKeeperService } from './data-keeper.service';

@Module({
  providers: [DataKeeperService]
})
export class DataKeeperModule {}
