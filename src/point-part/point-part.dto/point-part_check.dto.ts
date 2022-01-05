import { IsNumber, IsString } from 'class-validator';

export class PointPart_checkDto {
  @IsNumber()
  classId: string;

  @IsString()
  name: string;

  @IsNumber()
  ratio: number;

  @IsNumber()
  order: number;
}
