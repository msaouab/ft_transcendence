import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FtStrategy } from '../auth/strategy/ft.strategy';
import { AchvController  } from './achv.controller';
import { AchvService } from './achv.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';


@Module({
  controllers: [AchvController],
  providers: [ConfigService, FtStrategy, UserService, AuthService, AchvService],
  exports: [AchvService],
})
export class AchvModule { }
