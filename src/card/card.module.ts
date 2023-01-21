import { Module } from '@nestjs/common';
import { DataKeeperModule } from '../data-keeper/data-keeper.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
  imports: [DataKeeperModule],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService]
})
export class CardModule {}
