import { IsNotEmpty } from 'class-validator';

export class AnalyzeReviewDto {
  @IsNotEmpty()
  experience: string;

  @IsNotEmpty()
  liked: string;

  @IsNotEmpty()
  disliked: string;

  @IsNotEmpty()
  comment: string;
}
