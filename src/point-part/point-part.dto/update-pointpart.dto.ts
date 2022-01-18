import { IsNumber, IsString } from 'class-validator';

export class UpdatePointPartDTO {
  @IsNumber()
  classId;
  number;

  @IsNumber()
  ratio: number;

  @IsString()
  name: string;
}
