import { Module } from '@nestjs/common';
import { DataKeeperModule } from 'src/data-keeper/data-keeper.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DataKeeperModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
