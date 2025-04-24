import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Categories } from '../categories.enum';

export class AddItemDto {
  @IsEnum(Categories)
  category: Categories;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @MaxLength(1000)
  description: string;
}
