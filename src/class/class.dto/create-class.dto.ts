import { IsString, Length } from 'class-validator';

export class createClassDto {
	@IsString()
	@Length(6, 255)
	name: string;
}
