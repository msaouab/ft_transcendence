import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { configValidationSchema } from "./config.schema";
// Modules
import { AuthModule } from "./auth/auth.module";
import { InvitesModule } from "./invites/invites.module";
import { UserModule } from "./user/user.module";
import { GameModule } from "./game/game.module";
import { ChatModule } from "./chat/chat.module";
import { BlockedUsersModule } from "./blockedUsers/blockedUsers.module";
//Contollers
import { AppController } from "./app.controller";
import { UserController } from "./user/user.controller";
import { GameController } from "./game/game.controller";
//services
import { AuthService } from "./auth/auth.service";
import { UserService } from "./user/user.service";
import { GameService } from "./game/game.service";
import { MulterModule } from "@nestjs/platform-express";
import { ChannelModule } from "./channel/channel.module";
import { ChatGateway } from "./chat/chat.gateway";
import { SearchWebSocketModule } from "./searchWebSocket/search.module";
import { SearchModule } from "./search/search.module";
import { AchvModule } from "./achievements/achv.module";
import {NotificationModule} from "./notify/notify.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      validationSchema: configValidationSchema,
    }),
    MulterModule.register({
      dest: "../public",
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    InvitesModule,
    GameModule,
    ChannelModule,
    ChatModule,
    BlockedUsersModule,
    SearchWebSocketModule,
    SearchModule,
    AchvModule,
    NotificationModule
  ],

  controllers: [AppController, UserController, GameController],
  providers: [AuthService, UserService, GameService],
})
export class AppModule {}
