import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetItemsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  minRating?: number;

  @IsOptional()
  @IsNotEmpty()
  maxRating?: number;
}
