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
//Contollershttps://github.com/msaouab/ft_transcendence/pull/42/conflict?name=srcs%252Frequirements%252FBackend%252Fsrc%252Fdb-env-example&ancestor_oid=f2f4de32823e580c78be55d63663e1c20883c08a&base_oid=eebd1c49da0401821213abe4459b8d096bc03b76&head_oid=970db0dbf1064ef979c8e2ef9f8f3be643f90b7e
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
    NotificationModule,
  ],
  controllers: [AppController, UserController, GameController],
  providers: [AuthService, UserService],
})
export class AppModule {}
