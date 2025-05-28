import { Injectable, Logger } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/auth/user.entity';
import { Review } from './review.entity';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { ReviewsServiceInterface } from './reviews-service.interface';
import * as NodeCache from 'node-cache';

@Injectable()
export class ReviewsProxy implements ReviewsServiceInterface {
  private logger = new Logger('ReviewsProxy');
  private cache = new NodeCache({ stdTTL: 600 });

  constructor(private reviewsService: ReviewsService) {}

  async getReviewsByItem(
    itemId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationDto<Review>> {
    const cacheKey = `item-${itemId}-reviews-${JSON.stringify(pagination)}`;
    const cachedReviews = this.cache.get<PaginationDto<Review>>(cacheKey);
    if (cachedReviews) {
      this.logger.verbose(
        `[CACHED] Getting reviews for item... {itemId: ${itemId}}`,
      );
      return cachedReviews;
    }
    this.logger.verbose(`Getting reviews for item... {itemId: ${itemId}}`);
    const reviews = await this.reviewsService.getReviewsByItem(
      itemId,
      pagination,
    );
    this.cache.set(cacheKey, reviews);
    return reviews;
  }

  async getReviewsByUser(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationDto<Review>> {
    const cacheKey = `user-${userId}-reviews-${JSON.stringify(pagination)}`;
    const cachedReviews = this.cache.get<PaginationDto<Review>>(cacheKey);
    if (cachedReviews) {
      this.logger.verbose(
        `[CACHED] Getting reviews for user... {userId: ${userId}}`,
      );
      return cachedReviews;
    }
    this.logger.verbose(`Getting reviews for user... {userId: ${userId}}`);
    const reviews = await this.reviewsService.getReviewsByUser(
      userId,
      pagination,
    );
    this.cache.set(cacheKey, reviews);
    return reviews;
  }

  async createReview(
    createReviewDto: CreateReviewDto,
    user: User,
    itemId: string,
  ): Promise<void> {
    this.logger.verbose(
      `Creating a review... {user: ${user.username}, itemId: ${itemId}}`,
    );
    return this.reviewsService.createReview(createReviewDto, user, itemId);
  }
}
