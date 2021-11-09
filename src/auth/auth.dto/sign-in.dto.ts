import { IsString } from 'class-validator';

export class signInDto {
	@IsString()
	username: string;

	@IsString()
	password: string;
}
