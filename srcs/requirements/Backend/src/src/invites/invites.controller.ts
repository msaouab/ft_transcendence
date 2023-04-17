import {
    Controller,
    Get,
    Post,
    Put,
    Param,
    Body
} from "@nestjs/common";

import { ApiTags } from "@nestjs/swagger";


// Services
import { InvitesService } from './invites.service';

// dto's
import { PostInviteDto } from './dto/post-invite.dto';

import { PutInviteDto } from './dto/put-invite.dto';

@ApiTags('User')
@Controller('User')
export class InvitesController {

    constructor(private readonly InvitesService: InvitesService) { }

    @Get(':id/invites')
    async getInvites(@Param('id') id: string) {
        const invites = await this.InvitesService.getInvites(id);
        return invites;
    }

    @Post(':id/invites')
    postInvites(@Body() postInviteDto: PostInviteDto, @Param('id') sender_id: string) {
        return this.InvitesService.postInvites(postInviteDto, sender_id);
    }

    @Put(':id/invites')
    putInvites(@Body() putInviteDto: PutInviteDto, @Param('id') sender_id: string) {
        return this.InvitesService.putInvites(putInviteDto, sender_id);
    }

}
