import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AddItemDto {
  @IsString()
  categorySlug: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @MaxLength(1000)
  description: string;
}
