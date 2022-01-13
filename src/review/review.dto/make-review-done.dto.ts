import { IsNumber, IsString, Length, Min, Max } from 'class-validator';

export class MakeReviewDoneDto {
  @IsNumber()
  pointPartId: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  finalPoint: number;

  @IsNumber()
  csId: number;
}
