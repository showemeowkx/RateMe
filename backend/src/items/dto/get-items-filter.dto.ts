import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsNumber()
  minRating?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  maxRating?: number;
}
