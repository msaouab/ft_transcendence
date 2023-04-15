import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FtStrategy } from '../auth/strategy/ft.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';


@Module({
  controllers: [UserController],
  providers: [ConfigService, FtStrategy, UserService],
})
export class UserModule {}
