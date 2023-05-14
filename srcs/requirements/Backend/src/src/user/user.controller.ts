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
import { UserService } from "./user.service";
import { Profile } from "passport";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { User } from "../auth/user.decorator/user.decorator";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { PutUserDto } from "./dto/put-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthService } from "src/auth/auth.service";
import { TfaDto } from "./dto/Tfa.dto";
import { ChatService } from "src/chat/chat.service";
import { Inject, forwardRef } from "@nestjs/common";
import { UserExistsGuard } from "src/guards/user-exists.guard";

@ApiTags("User")
@Controller("User")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,

    private readonly chatService: ChatService
  ) {}

  @Get(":id")
  // add auth later
  // @UseGuards(AuthenticatedGuard)
  ftAuth(@Param("id") id: string) {
    return this.userService.getUser(id);
  }

  @Put(":id/update")
  @UseGuards(AuthenticatedGuard)
  updateUser(
    @Param("id") id: string,
    @User() user: Profile,
    @Body() PutUserDto: PutUserDto
  ) {
    return this.userService.updateUser(id, user, PutUserDto);
  }

  @Get(":id/chatrooms/private")
  // add auth later
  // @UseGuards(AuthenticatedGuard, UserExistsGuard)
  @UseGuards(UserExistsGuard)
  @ApiQuery({
    name: "limit",
    required: false,
    description: "limit the number of chatrooms returned (default 10)",
  })
  async getPrivateChat(@Param("id") id: string, @Query("limit") limit: string) {
    const privateChat = await this.chatService.getPrivateChatRooms(id, limit);
    return privateChat;
  }

  @Get(":id/chatrooms/group")
  // add auth later
  // @UseGuards(AuthenticatedGuard, UserExistsGuard)
  @UseGuards(UserExistsGuard)
  async getGroupChat(@Param("id") id: string) {
    console.log("getGroupChat");
  }

  @Get(":id/rankData")
  @UseGuards(AuthenticatedGuard)
  getRankData(@Param("id") id: string) {
    return this.userService.getRankData(id);
  }

  @Post(":id/avatar")
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "/app/public",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
      },
    })
  )
  handleUpload(
    @Param("id") id: string,
    @User() user: Profile,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.userService.uploadImage(id, user, file);
  }

  @Get(":id/avatar")
  @UseGuards(AuthenticatedGuard)
  async getImage(@Param("id") id: string, @Res() res) {
    const imageData = await this.userService.getImage(id);
    res.set("Content-Type", imageData.contentType);
    res.send(imageData.buffer);
  }

  @Put(":id/2fa")
  @UseGuards(AuthenticatedGuard)
  async set2fa(
    @Param("id") id: string,
    @Query() TfaDto: TfaDto,
    @User() user: Profile
  ) {
    return this.authService.set2fa(id, TfaDto, user);
  }

  @Put(":id/:status")
  @UseGuards(AuthenticatedGuard)
  async setStatus(
    @Param("id") id: string,
    @Param("status") status: string,
    @User() user: Profile
  ) {
    return this.userService.setStatus(id, status, user);
  }

  // updateUser(@Param('id') id: string,@User() user: Profile, @Body() PutUserDto: PutUserDto) {
  //     return this.userService.updateUser(id, user, PutUserDto);
  // }

  @Get(":id/channels")
  @UseGuards(AuthenticatedGuard)
  getJoindChannels(@Param("id") id: string) {
    return this.userService.getJoindChannels(id);
  }
}
