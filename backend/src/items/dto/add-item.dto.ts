import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AddItemDto {
  @IsString()
  categorySlug: string;

  @IsString()
  @MinLength(5)
  @MaxLength(150)
  name: string;

  @IsNotEmpty()
  @MaxLength(2000)
  description: string;
}
