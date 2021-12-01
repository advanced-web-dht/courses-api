import { IsString, IsDate } from 'class-validator';

export class Assignment_checkDto {
	@IsString()
	name: string;

	@IsString()
	pointPartId: string;

	@IsDate()
	dateEnded: Date;
}
