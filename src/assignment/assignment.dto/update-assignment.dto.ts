import { IsString, IsNumber } from 'class-validator';

export class UpdateAssignmentDto {
  @IsString()
  name: string;

  dateEnded: Date;

  @IsNumber()
  id: number;
}
