import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FtStrategy } from './strategy/ft.strategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session/session.serialize';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [ConfigService, FtStrategy, SessionSerializer, AuthService],
})
export class AuthModule {}
