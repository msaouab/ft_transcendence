import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FtStrategy } from '../auth/strategy/ft.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [UserController],
  providers: [ConfigService, FtStrategy, UserService],
  exports: [UserService]
})
export class UserModule { }
