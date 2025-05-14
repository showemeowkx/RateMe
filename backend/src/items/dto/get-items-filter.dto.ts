import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Categories } from '../../categories/categories.enum';

export class GetItemsFilterDto {
  @IsOptional()
  @IsEnum(Categories)
  category?: Categories;

  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  minRating?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  maxRating?: number;
}
