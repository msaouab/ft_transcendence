import { Body, Controller, Get, Post, Req, Res, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
// import { AuthDto } from './dto/auth.dto';

@ApiTags('User')
@Controller({
  version: process.env.API_VERSION,
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('signup')
  signup() {
    return this.authService.signup();
  }

  // @Get('login')
  // login() {
  //   return this.authService.login();
  // }
}