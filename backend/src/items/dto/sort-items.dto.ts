import { IsOptional, IsString } from 'class-validator';

export class SortItemsDto {
  @IsOptional()
  @IsString()
  sorting?: 'ASC' | 'DESC';
}
