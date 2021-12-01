import { IsObject } from 'class-validator';

export class PointPart_updateDto {
	@IsObject()
	order: Record<string, unknown>;
}
