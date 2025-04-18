import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Categories } from '../categories.enum';

export class AddItemDto {
  //placeholder
  @IsNotEmpty()
  image: string;

  @IsEnum(Categories)
  category: Categories;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  //will be reworked later
  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
