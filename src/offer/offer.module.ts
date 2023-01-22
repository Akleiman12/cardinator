import { Module } from '@nestjs/common';
import { CardModule } from '../card/card.module';
import { DataKeeperModule } from '../data-keeper/data-keeper.module';
import { UserModule } from '../user/user.module';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
  imports: [UserModule, DataKeeperModule, CardModule],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService]
})
export class OfferModule {}
