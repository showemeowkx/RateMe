import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { AuthModule } from 'src/auth/auth.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CategoriesModule } from 'src/categories/categories.module';
import { ItemsProxy } from './items.proxy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    AuthModule,
    CategoriesModule,
    NestjsFormDataModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsProxy],
  exports: [ItemsProxy],
})
export class ItemsModule {}
