


import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


enum InviteStatus {
    PENDING = 'Pending',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
}

export class PutInviteDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    receiver_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    status: InviteStatus;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    notification_id: string;
}



