import {
    Controller,
    Get,
    Post,
    Put,
    Param,
    Body,
    Delete
} from "@nestjs/common";

import { ApiTags } from "@nestjs/swagger";


// Services
import { InvitesService } from './invites.service';

// dto's
import { PostInviteDto } from './dto/post-invite.dto';
import { DeleteInviteDto } from "./dto/delete-invite.dto";
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
    postInvites(@Body() postInviteDto: PostInviteDto, @Param('id') receiver_id: string) {
        return this.InvitesService.postInvites(postInviteDto, receiver_id);
    }

    @Put(':id/invites')
    putInvites(@Body() putInviteDto: PutInviteDto, @Param('id') receiver_id: string) {
        return this.InvitesService.putInvites(putInviteDto, receiver_id);
    }

    @Delete(':id/invites')
    deleteInvites(@Body() DeleteInviteDto: DeleteInviteDto, @Param('id') receiver_id: string) {
        return this.InvitesService.deleteInvites(DeleteInviteDto, receiver_id);
    }


}
