import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  username: string;
}
