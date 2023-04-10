import {
    Controller,
    Get,
    Post,
} from "@nestjs/common";

import { ApiTags } from "@nestjs/swagger";

@ApiTags('User')
@Controller('User')
export class InvitesController {
    @Get(':id/invites')
    getInvites() {
        return 'getInvites';
    }
    @Post(':id/invites')
    postInvites() {
        return 'postInvites';
    }
}
