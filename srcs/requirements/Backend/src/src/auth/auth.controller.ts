import { Controller, Get, Redirect, Res, UseGuards } from '@nestjs/common';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import { AuthService } from './auth.service';
import { User } from './user.decorator/user.decorator';
import { Profile } from 'passport';
import { ApiTags } from '@nestjs/swagger';


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
  // make the redirect url dynamic
  @Redirect('http://localhost:5173/home')
  // @Redirect(`${process.env.FRONTEND_URL}/home`)
  ftAuthCallback(@User() user: Profile, @Res() res: Response) {
    return this.authService.login(user, res);
  }


}
