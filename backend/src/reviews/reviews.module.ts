import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ItemsModule } from 'src/items/items.module';
import { ReviewsProxy } from './reviews.proxy';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), AuthModule, ItemsModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: 'REVIEWS_SERVICE',
      useFactory: (reviewsService: ReviewsService) => {
        return new ReviewsProxy(reviewsService);
      },
      inject: [ReviewsService],
    },
  ],
})
export class ReviewsModule {}
