import { IsString, Length, IsEmail } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsString()
  @Length(6, 16)
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
