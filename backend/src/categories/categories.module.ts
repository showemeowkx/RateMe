import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesProxy } from './categories.proxy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    AuthModule,
    NestjsFormDataModule,
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: 'CATEGORIES_SERVICE',
      useFactory: (categoriesService: CategoriesService) =>
        new CategoriesProxy(categoriesService),
      inject: [CategoriesService],
    },
  ],
  exports: ['CATEGORIES_SERVICE'],
})
export class CategoriesModule {}
