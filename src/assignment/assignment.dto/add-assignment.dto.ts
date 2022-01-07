import { IsString } from 'class-validator';

export class AddAssignmentDto {
  @IsString()
  name: string;

  @IsString()
  pointPartId: string;

  dateEnded: Date;
}
