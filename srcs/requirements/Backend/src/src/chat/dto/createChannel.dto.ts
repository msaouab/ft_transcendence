import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator"

enum ChannelStatus {
    Public = "Public",
    Private = "Private",
    Secret = "Secret"
}

export class ChannelDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsEnum(ChannelStatus)
    status: ChannelStatus

    @ValidateIf((o) => o.status === ChannelStatus.Secret)
    @IsString()
    @IsNotEmpty()
    password: string

    limitUsers: number

    @IsOptional()
    description: string

    @IsOptional()
    avatar: string

    @IsString()
    @IsNotEmpty()
    owner: string
}