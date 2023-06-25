import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

enum Status {
    Online = 'Online',
  Offline = 'Offline',
  Idle = 'Idle',
  DoNotDisturb = 'DoNotDisturb',
}

export class PutStatusDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    status: Status;

};
