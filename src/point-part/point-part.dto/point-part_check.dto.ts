import { IsNumber, IsString } from 'class-validator';

export class PointPart_checkDto {
  @IsNumber()
  classId: number;

  @IsString()
  name: string;

  @IsNumber()
  ratio: number;

  @IsNumber()
  order: number;
}
