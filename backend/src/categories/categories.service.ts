/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CategoriesService implements CategoriesService {
  private logger = new Logger('CategoriesService', { timestamp: true });
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getCategories(filterDto: GetCategoriesFilterDto): Promise<Category[]> {
    const { name, slug } = filterDto;
    const query = this.categoriesRepository.createQueryBuilder('category');

    if (name) {
      query.andWhere('LOWER(category.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (slug) {
      query.andWhere('category.slug = :slug', { slug });
    }

    try {
      return query.getMany();
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to get categories {filters: ${JSON.stringify(filterDto)}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const { name, slug, color } = createCategoryDto;

    let imageUrl = '';

    if (file) {
      try {
        const result = await this.cloudinaryService.uploadFile(file);
        imageUrl = result.secure_url as string;
      } catch (error) {
        this.logger.error('[INTERNAL] Cloudinary upload failed', error.stack);
        throw new InternalServerErrorException();
      }
    } else {
      this.logger.error('[INTERNAL] File is required');
      throw new InternalServerErrorException();
    }

    const category = this.categoriesRepository.create({
      name,
      slug,
      color,
      imagePath: imageUrl,
    });

    try {
      await this.categoriesRepository.save(category);
    } catch (error) {
      if (error.code === '23505') {
        this.logger.error(
          `[ALREADY EXISTS] Failed to create a category {slug: ${slug}}`,
          error.stack,
        );
        throw new ConflictException(
          'A category with this slug/name already exists',
        );
      }
      this.logger.error(
        `[INTERNAL] Failed to create a category {slug: ${slug}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteCategory(slug: string): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: ['items'],
    });

    if (!category) {
      this.logger.error(
        `[NOT FOUND] Failed to delete a category {slug: ${slug}}`,
      );
      throw new ConflictException(
        `A category with slug '${slug}' doesn't exist`,
      );
    }

    try {
      await this.categoriesRepository.remove(category);
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to delete a category {slug: ${slug}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
