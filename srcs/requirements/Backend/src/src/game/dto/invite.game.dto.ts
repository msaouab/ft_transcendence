import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
// import { Status } from '@prisma/client';

enum Status {
    PENDING = 'Pending',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
}

enum Mode {
    TIME = 'Time',
    ROUND = 'Round',
}

export class inviteGameDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    invited: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    send: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    mode: Mode
};

export class StatusInviteDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    status: Status

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    recvId: string
}
