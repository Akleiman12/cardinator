import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { jwtConfig } from 'config/jwt.config';
import { JwtAuthGuard } from './guards/jwt.guard';
import { DataKeeperModule } from '../data-keeper/data-keeper.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    DataKeeperModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConfig.secretKey,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtAuthGuard]
})
export class UserModule {}
