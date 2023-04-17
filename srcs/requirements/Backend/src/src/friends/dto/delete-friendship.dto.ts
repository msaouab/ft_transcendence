import {
    IsNotEmpty,
    IsString,

} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class DeleteFriendshipDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    friendUser_id: string;
}
