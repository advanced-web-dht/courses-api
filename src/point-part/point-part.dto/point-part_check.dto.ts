import { IsNumber, IsString } from 'class-validator';

export class PointPart_checkDto {
	@IsString()
	classId: string;

	@IsString()
	name: string;

	@IsNumber()
	ratio: number;

	@IsNumber()
	order: number;
}
