import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { jwtConfig } from 'config/jwt.config';
import { JwtAuthGuard } from './guards/jwt.guard';
import { DataKeeperModule } from '../data-keeper/data-keeper.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { CardModule } from 'src/card/card.module';

@Module({
  imports: [
    DataKeeperModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConfig.secretKey,
      signOptions: { expiresIn: '1d' }
    }),
    HttpModule.register({ timeout: 5000 }),
    CardModule
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtAuthGuard],
  exports: [UserService]
})
export class UserModule {}
