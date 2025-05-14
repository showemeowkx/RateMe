import { IsOptional, IsString } from 'class-validator';

export class GetCategoriesFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
