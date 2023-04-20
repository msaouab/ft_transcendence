import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

enum ChannelStatus{
    Public="Public",
    Private="Private",
    Secret ="Secret"
}

export class ChannelDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    status: ChannelStatus

    @ApiProperty()
    password?: string
    @ApiProperty()
    limitUsers?: number
}