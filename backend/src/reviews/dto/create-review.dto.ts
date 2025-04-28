import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UsePeriod } from '../use-period.enum';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsEnum(UsePeriod)
  usePeriod: UsePeriod;

  @IsNotEmpty()
  @IsBoolean()
  isRecommended: boolean;

  @IsNotEmpty()
  @MaxLength(300)
  @IsString()
  liked: string;

  @IsNotEmpty()
  @MaxLength(300)
  @IsString()
  disliked: string;

  @MinLength(20)
  @MaxLength(1000)
  @IsString()
  text: string;
}
