import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator"

enum ChannelStatus {
    Public = "Public",
    Private = "Private",
    Secret = "Secret"
}

export class ChannelDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @ApiProperty()
    @IsEnum(ChannelStatus)
    status: ChannelStatus

    @ApiProperty()
    @ValidateIf((o) => o.status === ChannelStatus.Secret)
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    limitUsers: number

    @ApiProperty()
    @IsOptional()
    description: string

    @ApiProperty()
    @IsOptional()
    avatar: string
}