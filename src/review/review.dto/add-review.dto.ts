import { IsNumber, IsString, Length } from 'class-validator';

export class AddReviewDto {
  @IsNumber()
  pointPartId: number;

  @IsString()
  @Length(10, 1000)
  content: string;
}
