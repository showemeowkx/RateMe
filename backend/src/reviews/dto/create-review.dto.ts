import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UsePeriod } from '../use-period.enum';

export class CreateReviewDto {
  @IsEnum(UsePeriod)
  usePeriod: UsePeriod;

  @MaxLength(1000)
  @IsString()
  liked?: string;

  @MaxLength(1000)
  @IsString()
  disliked?: string;

  @MinLength(10)
  @MaxLength(3000)
  @IsString()
  text: string;
}
