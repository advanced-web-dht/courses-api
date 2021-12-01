import { IsString } from 'class-validator';

export class Assignment_checkDto {
	@IsString()
	name: string;

	@IsString()
	pointPartId: string;

	@IsString()
	dateEnded: string;
}
