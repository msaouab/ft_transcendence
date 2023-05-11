import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FtStrategy } from '../auth/strategy/ft.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';


@Module({
  controllers: [UserController],
  providers: [ConfigService, FtStrategy, UserService, AuthService],
  exports: [UserService]
})
export class UserModule { }
