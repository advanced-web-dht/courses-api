import { IsNumber, IsString, Length, Min, Max } from 'class-validator';

export class AddReviewDto {
  @IsNumber()
  pointPartId: number;

  @IsNumber()
  prePoint: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  expectedPoint: number;

  @IsString()
  @Length(10, 1000)
  content: string;
}
