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

  @IsNotEmpty()
  @IsEnum(UsePeriod)
  usePeriod: UsePeriod;

  @IsNotEmpty()
  @IsBoolean()
  isRecommended: boolean;

  //will be reworked later
  @IsString()
  liked: string;

  //will be reworked later
  @IsString()
  disliked: string;

  @MinLength(20)
  @MaxLength(1000)
  @IsString()
  text: string;
}
