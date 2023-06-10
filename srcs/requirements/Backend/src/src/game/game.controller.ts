import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	Redirect,
	UseGuards,
	Req,
  } from "@nestjs/common";
  import { UserService } from "../user/user.service";
  import { Profile } from "passport";
  import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
  import { User } from "../auth/user.decorator/user.decorator";
  import { ApiTags } from "@nestjs/swagger";
  import { GameService } from "./game.service";
  import { StatusInviteDto, inviteGameDto } from "./dto/invite.game.dto";
  import { Request } from "express";
  
  @ApiTags("game")
  @Controller("game")
  export class GameController {
	constructor(private readonly gameService: GameService) {}
  
	//   @Get(':id')
	//   @UseGuards(AuthenticatedGuard)
	//     ftAuth(@Param('id') id: string) {
	//         return this.userService.getUser(id);
	//     }
  
	@Post("invite")
	@UseGuards(AuthenticatedGuard)
	StartGame(@Body() inviteGameDto: inviteGameDto, @User() user: Profile, @Req() req: Request){
	  return this.gameService.createInvite(user, inviteGameDto);
	}
	@Put("invite/respond/:id")
	@UseGuards(AuthenticatedGuard)
	updateInvite(@Body() StatusInviteDto: StatusInviteDto, @User() user: Profile, @Param("id") id: string) {
	  return this.gameService.updateInvite(user, StatusInviteDto, id);
	}
	// @Post("/game/:id")
	// @UseGuards(AuthenticatedGuard)

  }
  //   @Put(':id/update')
  //   @UseGuards(AuthenticatedGuard)
  //     updateUser(@Param('id') id: string,@User() user: Profile) {
  //         return this.userService.updateUser(id, user, PutUserDto);
  //     }
  