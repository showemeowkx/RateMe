import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Categories } from '../categories.enum';

export class GetItemsFilterDto {
  @IsOptional()
  @IsEnum(Categories)
  category?: Categories;

  @IsOptional()
  @IsNotEmpty()
  rating?: number;
}
