import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UsePeriod } from '../use-period.enum';

export class CreateReviewDto {
  @IsEnum(UsePeriod)
  usePeriod: UsePeriod;

  @IsNotEmpty()
  @IsBoolean()
  isRecommended?: boolean;

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
