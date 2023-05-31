import { Controller, Get, Redirect, Res, UseGuards } from '@nestjs/common';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import { AuthService } from './auth.service';
import { User } from './user.decorator/user.decorator';
import { Profile } from 'passport';
import { ApiTags } from '@nestjs/swagger';
import { HOSTNAME } from 'src/main';


@ApiTags('login')
@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Get('42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(FtOauthGuard)
  // @Redirect('http://localhost:5173/home')
  async ftAuthCallback(@User() user: Profile, @Res() res) {
    const User = await this.authService.login(user, res);
    if (User.tfa == true && User.otp_verified == false) {
      return res.redirect('http://'+HOSTNAME+':5173/tfa');
    }
    return res.redirect('http://'+HOSTNAME+':5173/profile');
  }


}
