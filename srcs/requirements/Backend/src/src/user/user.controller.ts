import { Body, Controller, Get, Param, Post, Put, Redirect, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FtOauthGuard } from '../auth/guards/ft-oauth.guard';
import { UserService } from './user.service';
import { Profile } from 'passport';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { User } from '../auth/user.decorator/user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { PutUserDto } from './dto/put-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get(':id')
  @UseGuards(AuthenticatedGuard)
    ftAuth(@Param('id') id: string) {
        return this.userService.getUser(id);
    }

  @Put(':id/update')
  @UseGuards(AuthenticatedGuard)
    updateUser(@Param('id') id: string,@User() user: Profile, @Body() PutUserDto: PutUserDto) {
        return this.userService.updateUser(id, user, PutUserDto);
    }

    @Get(':id/rankData')
    @UseGuards(AuthenticatedGuard)
    getRankData(@Param('id') id: string) {
        return this.userService.getRankData(id);    
    }

    @Post(':id/file')
    //@UseGuards(AuthenticatedGuard)
    @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '/app/public',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
    handleUpload(@Param('id') id: string, @User() user: Profile, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadImage(id,user,file);
}

}
