import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { CardModule } from './card/card.module';
import { OfferModule } from './offer/offer.module';
import { DataKeeperModule } from './data-keeper/data-keeper.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

@Module({
  imports: [UserModule, CardModule, OfferModule, DataKeeperModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
