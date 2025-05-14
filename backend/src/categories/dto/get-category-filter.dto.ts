import { IsOptional, IsString } from 'class-validator';

export class GetCategoryFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
