import { IsArray, IsNumber } from 'class-validator';

export class AddPointListDto {
  @IsArray()
  points: Array<{ csId: number; point: number }>;

  @IsNumber()
  classId: number;

  @IsNumber()
  pointpartId: number;
}
