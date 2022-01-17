import { IsArray, IsNumber } from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  classId;
  number;

  @IsArray()
  order: Record<string, number>[];
}
