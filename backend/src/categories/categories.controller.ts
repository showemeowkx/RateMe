import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { setStorageOptions } from 'src/common/file-upload';
import { Category } from './category.entity';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { ModeratorGuard } from 'src/common/decorators/guards/moderator.guard';
import { CategoriesProxy } from './categories.proxy';

const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesProxy) {}

  @Get()
  getCategories(
    @Query() filterDto: GetCategoriesFilterDto,
  ): Promise<Category[]> {
    return this.categoriesService.getCategories(filterDto);
  }

  @Post()
  @UseGuards(ModeratorGuard)
  @UseInterceptors(
    FileInterceptor(
      'file',
      setStorageOptions('category-images', allowedExtensions),
    ),
  )
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return this.categoriesService.createCategory(createCategoryDto, file);
  }
}
