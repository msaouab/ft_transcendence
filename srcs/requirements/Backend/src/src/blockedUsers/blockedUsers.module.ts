
import { Module } from '@nestjs/common';
import { BlockedUsersService } from './blockedUsers.service';
import { BlockedUsersController } from './blockedUsers.controller';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [BlockedUsersController],
    providers: [BlockedUsersService],
    exports: []
})
export class BlockedUsersModule { }
