import { IsArray, IsNumber } from 'class-validator';

export class AddPointListDto {
  @IsArray()
  points: Array<{ studentId: string; point: number }>;

  @IsNumber()
  classId: number;

  @IsNumber()
  pointpartId: number;
}
