import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UsePeriod } from '../use-period.enum';

export class CreateReviewDto {
  @IsEnum(UsePeriod)
  usePeriod: UsePeriod;

  @MaxLength(700)
  @IsString()
  liked?: string;

  @MaxLength(700)
  @IsString()
  disliked?: string;

  @MinLength(20)
  @MaxLength(1500)
  @IsString()
  text: string;
}
