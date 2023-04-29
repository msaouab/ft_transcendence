import { Controller, Get, Redirect, Res, UseGuards } from '@nestjs/common';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import { AuthService } from './auth.service';
import { User } from './user.decorator/user.decorator';
import { Profile } from 'passport';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(FtOauthGuard)
  @Redirect('http://localhost:5173/home')
  ftAuthCallback(@User() user: Profile, @Res() res: Response) {
    return this.authService.login(user, res);
  
  }


}
