import { IsArray, IsNumber, IsObject } from 'class-validator';

export class Point_checkDto {
  @IsArray()
  point: Record<string, any>[];
  @IsNumber()
  classId: number;

  @IsNumber()
  pointpartId: number;
}
