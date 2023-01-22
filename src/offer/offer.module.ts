import { Module } from '@nestjs/common';
import { CardModule } from 'src/card/card.module';
import { DataKeeperModule } from 'src/data-keeper/data-keeper.module';
import { UserModule } from 'src/user/user.module';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
  imports: [UserModule, DataKeeperModule, CardModule],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService]
})
export class OfferModule {}
