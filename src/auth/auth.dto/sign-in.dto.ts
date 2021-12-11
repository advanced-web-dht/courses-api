import { IsString } from 'class-validator';

export class SignInGoogleDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  accessToken: string;
}
