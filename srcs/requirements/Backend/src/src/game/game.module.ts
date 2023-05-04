import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FtStrategy } from '../auth/strategy/ft.strategy';
import { GameController } from './game.controller';
import { UserService } from '../user/user.service';
import { GameService } from './game.service';
import { GameGateway } from './Pong/game.Gateway'


@Module({
  controllers: [GameController],
  providers: [ConfigService, FtStrategy, UserService, GameService, GameGateway],
  exports: [GameService]
})

export class GameModule { }
