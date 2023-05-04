import { Body, Controller, Get, Param, Post, Put, Query, Redirect, UseGuards, Req } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Profile } from 'passport';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { User } from '../auth/user.decorator/user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { StatusInviteDto, inviteGameDto } from './dto/invite.game.dto';
import { Request } from 'express';

@ApiTags('Game')
@Controller('Game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  
//   @Get(':id')
//   @UseGuards(AuthenticatedGuard)
//     ftAuth(@Param('id') id: string) {
//         return this.userService.getUser(id);
//     }

	@Post('start')
	@UseGuards(AuthenticatedGuard)
		StartGame(@Query('type') type: string, @Query('opponent') opponent: string, @User() user: Profile, @Body() inviteGameDto: inviteGameDto) {
			return (this.gameService.StartGame(type, opponent, user, inviteGameDto));
	}
	@Put('invite/:id')
	@UseGuards(AuthenticatedGuard)
		StatusInvite(@Param('id') id: string, @User() user: Profile, @Body() StatusInviteDto: StatusInviteDto, @Req() req: Request) {
			return (this.gameService.StatusInvite(id, user, StatusInviteDto, req));
	}

}
//   @Put(':id/update')
//   @UseGuards(AuthenticatedGuard)
//     updateUser(@Param('id') id: string,@User() user: Profile) {
//         return this.userService.updateUser(id, user, PutUserDto);
//     }
