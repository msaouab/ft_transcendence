


import { UserService } from 'src/user/user.service';
import { FriendsController } from './friends.controller';
import { FriendsService } from "./friends.service";
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [FriendsController],
    providers: [
        FriendsService,
        UserService
     ],
    exports: [FriendsService]
})
export class FriendsModule { }

