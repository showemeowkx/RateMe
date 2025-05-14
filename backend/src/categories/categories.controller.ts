import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
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

const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

//will be guarded by moderator guard later
@UseGuards(AuthGuard())
@Controller('categories')
export class CategoriesController {
  private logger = new Logger('CategoriesController');
  constructor(private categoriesService: CategoriesService) {}

  @Get('/:slug')
  getCategoryBySlug(@Param('slug') slug: string): Promise<Category> {
    this.logger.verbose(`Getting a category by slug... {slug: ${slug}}`);
    return this.categoriesService.getCategoryBySlug(slug);
  }

  @Get()
  getCategories(@Query() name: string): Promise<Category[]> {
    this.logger.verbose(`Getting categories... {filters: {name: ${name}}}`);
    return this.categoriesService.getCategories(name);
  }

  @Post()
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
