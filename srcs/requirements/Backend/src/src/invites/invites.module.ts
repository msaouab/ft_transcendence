
import { Module } from '@nestjs/common';

import { InvitesController } from './invites.controller';
@Module({
    imports: [],
    controllers: [InvitesController],
    providers: [],
})
export class InvitesModule { }
