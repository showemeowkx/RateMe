import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CategoriesModule } from 'src/categories/categories.module';
import { ItemsProxy } from './items.proxy';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    AuthModule,
    CategoriesModule,
    NestjsFormDataModule,
    CloudinaryModule,
  ],
  controllers: [ItemsController],
  providers: [
    ItemsService,
    {
      provide: 'ITEMS_SERVICE',
      useFactory: (itemsService: ItemsService) => {
        return new ItemsProxy(itemsService);
      },
      inject: [ItemsService],
    },
  ],
  exports: ['ITEMS_SERVICE'],
})
export class ItemsModule {}
