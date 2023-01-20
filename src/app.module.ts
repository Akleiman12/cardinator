import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CardModule } from './card/card.module';
import { OfferModule } from './offer/offer.module';
import { DataKeeperModule } from './data-keeper/data-keeper.module';

@Module({
  imports: [UserModule, CardModule, OfferModule, DataKeeperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
