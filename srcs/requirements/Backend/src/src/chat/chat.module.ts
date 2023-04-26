import {
    Module
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

import { UserModule } from 'src/user/user.module';
@Module({
    imports: [UserModule],
    controllers: [],
    providers: [
        ChatService,
        ChatGateway
    ],
})
export class ChatModule { }