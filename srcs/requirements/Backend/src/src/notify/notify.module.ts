import {
    Module
} from '@nestjs/common';

import { NotificationGateway } from './notify.gateway';
import { NotificationService } from './notify.service';


@Module({
    imports: [],
    controllers: [],
    providers: [
        NotificationService,
        NotificationGateway
    ],
    exports: []
})
export class NotificationModule { }