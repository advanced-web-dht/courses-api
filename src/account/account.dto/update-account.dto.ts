import { IsString, IsNumber } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  name: string;

  @IsNumber()
  studentId: string;
}
