
import { Module } from '@nestjs/common';

import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import {UserModule} from '../user/user.module';
import { FriendsModule } from 'src/friends/friends.module';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [UserModule, FriendsModule],
    controllers: [InvitesController],
    providers: [InvitesService, UserService],
})
export class InvitesModule { }
