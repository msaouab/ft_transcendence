import {
    Module
} from '@nestjs/common';

import { MessageService } from './message.service'


import { MessageConroller } from './message.controller';

@Module({
    imports: [],
    controllers: [MessageConroller],
    providers: [
        MessageService
    ],
    exports: [MessageService]
})
export class MessageModule { }