import {
    Module
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

import { UserModule } from 'src/user/user.module';
import { ChatController } from './chat.conroller';
import { MessageModule } from './message/message.module';
@Module({
    imports: [MessageModule],
    controllers: [ChatController],
    providers: [
        ChatService,
        ChatGateway
    ],
    exports: [ChatService]
})
export class ChatModule { }