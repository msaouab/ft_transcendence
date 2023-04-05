
import { IsEmail, IsNotEmpty, Length, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Password has to be btwn 3 and 20 chars'})
  public password: string;
}
