import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

enum SearchEntity {
    All = "All",
    user = "Users",
    channel = "Channels"
}

export class SearchDto {
    @ApiProperty()
    @IsEnum(SearchEntity)
    entity: SearchEntity;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    keyword: string;
}