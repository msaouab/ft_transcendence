import { Body, Controller, Get, Param, Redirect, UseGuards } from '@nestjs/common';
import { FtOauthGuard } from '../auth/guards/ft-oauth.guard';
import { UserService } from './user.service';
import { Profile } from 'passport';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { User } from '../auth/user.decorator/user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { log } from 'console';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get(':id')
  @UseGuards(AuthenticatedGuard)
    ftAuth(@Param('id') id: string) {
        return this.userService.getUser(id);
    }

  @Get('update/:id')
  @UseGuards(AuthenticatedGuard)
    updateUser(@Param('id') id: string,@User() user: Profile, @Body() data: any) {
        return this.userService.updateUser(id, user, data);
    }

  @Get(':id/channels')
  @UseGuards(AuthenticatedGuard)
  getJoindChannels(@Param('id') id: string){
    return this.userService.getJoindChannels(id);
  }
}
