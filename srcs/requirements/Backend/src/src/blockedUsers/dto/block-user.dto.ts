
import {
    IsString,
    IsNotEmpty,

} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class BlockedUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    blockedUser_id: string;
}
