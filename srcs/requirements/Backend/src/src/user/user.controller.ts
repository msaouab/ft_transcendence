import { Body, Controller, Get, Param, Put, Redirect, UseGuards, Query } from '@nestjs/common';
import { FtOauthGuard } from '../auth/guards/ft-oauth.guard';
import { UserService } from './user.service';
import { Profile } from 'passport';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { User } from '../auth/user.decorator/user.decorator';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PutUserDto } from './dto/put-user.dto';
import { ChatService } from 'src/chat/chat.service';
import { Inject, forwardRef } from '@nestjs/common';
import {
  UserExistsGuard,
} from 'src/guards/user-exists.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly chatService: ChatService) { }

  @Get(':id')
  // add auth later
  // @UseGuards(AuthenticatedGuard)
  ftAuth(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Put(':id/update')
  @UseGuards(AuthenticatedGuard)
  updateUser(@Param('id') id: string, @User() user: Profile, @Body() PutUserDto: PutUserDto) {
    return this.userService.updateUser(id, user, PutUserDto);
  }


  @Get(":id/chatrooms/private")
  // add auth later
  // @UseGuards(AuthenticatedGuard, UserExistsGuard)
  @UseGuards(UserExistsGuard)
  @ApiQuery({ name: 'limit', required: false, description: 'limit the number of chatrooms returned (default 10)' })
  async getPrivateChat(@Param('id') id: string, @Query('limit') limit: string) {
    const privateChat = await this.chatService.getPrivateChatRooms(id, limit);
    return privateChat;
  }

  @Get(":id/chatrooms/group")
  // add auth later
  // @UseGuards(AuthenticatedGuard, UserExistsGuard)
  @UseGuards(UserExistsGuard)
  async getGroupChat(@Param('id') id: string) {
    console.log("getGroupChat");
  }




}

