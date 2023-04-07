import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signup')
  signup() {
    return this.authService.signup();
  }

  // @Get('login')
  // login() {
  //   return this.authService.login();
  // }
}