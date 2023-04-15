
import { Module } from '@nestjs/common';

import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import {UserModule} from 'src/user/user.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
    imports: [UserModule, FriendsModule],
    controllers: [InvitesController],
    providers: [InvitesService],
})
export class InvitesModule { }
