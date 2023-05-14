import { Module } from "@nestjs/common";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [UserModule],
    controllers: [ChannelController],
    providers: [ChannelService],
    exports: [ChannelService]
})
export class ChannelModule {}