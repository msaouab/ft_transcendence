import {Controller, Get, Redirect, Render, Req, UseGuards, Session, Param, Post, Body, Res} from '@nestjs/common';
import { User } from './auth/user.decorator/user.decorator';
import { Profile } from 'passport-42';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { UserService } from './user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { use } from 'passport';
import { ApiTags } from '@nestjs/swagger';
  
  
    // @ApiTags()
    // @Controller({
    // version: process.env.API_VERSION,
    // })
  @Controller()
  export class AppController {
    constructor(private authService: AuthService,
      private userservice: UserService) {}
    @Get()
    @Render('home')
    home(@User() user: Profile) {
      return { user };
    }
  
    
    @Get('login')
    @Render('login')
    login(@User() user: Profile) {
      return ;
    }
      
    @Get('profile')
    @UseGuards(AuthenticatedGuard)
    @Render('profile')
    profile(@User() user: Profile) {
      console.log(user.username);
      console.log(user._json.email);
      console.log(user.name.givenName);
      console.log(user.name.familyName);
      return { user };
    }
    @Get('logout')
    logOut(@Req() req: Request, @User() user: Profile, @Res() res: Response) {
        req.logout(function(err) {
            { return; }
          });
      return this.authService.logout(user, res);
    }

    @Get('delete')
    @UseGuards(AuthenticatedGuard)
    @Redirect('logout')
    async delete(@User() user: Profile, @Res() res: Response) {
      return this.authService.delete(user,res);
    }

    @Get('me')
    @UseGuards(AuthenticatedGuard)
    async me(@User() user: Profile) {
        return this.userservice.getUserByEmail(user._json.email);
    }





    // @Get('update')
    // @UseGuards(AuthenticatedGuard)
    // @Redirect('profile')
    // async update(@User() user: Profile, ) {
    //   return this.authService.update(user);
    // }

    // @Get('2fa')
    // @UseGuards(AuthenticatedGuard)
    // @Render('2fa')
    // async twoFactor(@User() user: Profile) {
    //     this.authService.twoFactor(user);
    // }

    // @Get('verify2fa')
    // @UseGuards(AuthenticatedGuard)
    // @Render('2faverify')
    // async twoFactorverif() {;
    // }

    // @Post('verify2fa/check')
    // @UseGuards(AuthenticatedGuard)
    // @Redirect('/profile')
    // async twoFactorverifcheck(@Body () body: any, @User() user: Profile, @Req() req) {
    //   return this.authService.twoFactorverify(body, user, req);


    }
  
