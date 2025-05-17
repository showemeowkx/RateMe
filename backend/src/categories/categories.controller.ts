import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { setStorageOptions } from 'src/common/file-upload';
import { Category } from './category.entity';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';

const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

@Controller('categories')
export class CategoriesController {
  private logger = new Logger('CategoriesController');
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getCategories(
    @Query() filterDto: GetCategoriesFilterDto,
  ): Promise<Category[]> {
    this.logger.verbose(
      `Getting categories... {filters: ${JSON.stringify(filterDto)}}`,
    );
    return this.categoriesService.getCategories(filterDto);
  }

  @Post()
  //will be guarded by moderator guard later
  @UseGuards(AuthGuard())
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
    this.logger.verbose(
      `Creating a new category... {slug: ${createCategoryDto.slug}}`,
    );
    return this.categoriesService.createCategory(createCategoryDto, file);
  }
}
