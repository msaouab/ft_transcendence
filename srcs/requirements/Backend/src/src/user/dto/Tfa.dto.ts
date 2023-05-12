import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class TfaDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)

    sixDigits: string;

};
