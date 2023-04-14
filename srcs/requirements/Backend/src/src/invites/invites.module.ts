
import { Module } from '@nestjs/common';

import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import {
    UserModule,
} from 'src/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [InvitesController],
    providers: [InvitesService],
})
export class InvitesModule { }
