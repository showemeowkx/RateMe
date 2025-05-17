import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UsePeriod } from '../use-period.enum';

export class CreateReviewDto {
  @IsEnum(UsePeriod)
  usePeriod: UsePeriod;

  @MaxLength(300)
  @IsString()
  liked?: string;

  @MaxLength(300)
  @IsString()
  disliked?: string;

  @MinLength(20)
  @MaxLength(1000)
  @IsString()
  text: string;
}
