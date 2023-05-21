import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Redirect,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FtOauthGuard } from "../auth/guards/ft-oauth.guard";
import { UserService } from "src/user/user.service";
import { Profile } from "passport";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { User } from "../auth/user.decorator/user.decorator";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { PutUserDto } from "../user/dto/put-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthService } from "src/auth/auth.service";
import { TfaDto } from "../user/dto/Tfa.dto";
import { ChatService } from "src/chat/chat.service";
import { Inject, forwardRef } from "@nestjs/common";
import { UserExistsGuard } from "src/guards/user-exists.guard";
import { PostGameDto } from "./dto/post.game.dto";
import { AchvService } from "./achv.service";

@ApiTags("achivements")
@Controller("achivements")
export class AchvController {
  constructor(
    private readonly userService: UserService,
    private readonly achvService: AchvService,
  ) {}

  @Post('achievements')
  testAchievements(@Body() body: PostGameDto) {
    return this.achvService.testAchievements(body);
  }
  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  getAchievements(@Param('id') id: string) {
    return this.achvService.getUserAchievements(id);
  }

}
