import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Category } from './category.entity';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { ModeratorGuard } from 'src/common/decorators/guards/moderator.guard';
import { CategoriesServiceIInterface } from './categories-service.interface';

@Controller('categories')
export class CategoriesController {
  constructor(
    @Inject('CATEGORIES_SERVICE')
    private categoriesService: CategoriesServiceIInterface,
  ) {}

  @Get()
  getCategories(
    @Query() filterDto: GetCategoriesFilterDto,
  ): Promise<Category[]> {
    return this.categoriesService.getCategories(filterDto);
  }

  @Post()
  @UseGuards(ModeratorGuard)
  @UseInterceptors(FileInterceptor('file'))
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    return this.categoriesService.createCategory(createCategoryDto, file);
  }

  @Delete('/:slug')
  @UseGuards(ModeratorGuard)
  deleteCategory(@Param('slug') slug: string): Promise<void> {
    return this.categoriesService.deleteCategory(slug);
  }
}
