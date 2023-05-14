
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetPrivateChatMessagesDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    privateChatRoom_id: string;
}
