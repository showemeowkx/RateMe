import { Injectable, Logger } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/auth/user.entity';
import { Review } from './review.entity';

@Injectable()
export class ReviewsProxy {
  private logger = new Logger('ReviewsProxy');

  constructor(private reviewsService: ReviewsService) {}

  async getReviewsByItem(itemId: string): Promise<Review[]> {
    this.logger.verbose(`Getting reviews for item... {itemId: ${itemId}}`);
    return this.reviewsService.getReviewsByItem(itemId);
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    this.logger.verbose(`Getting reviews for user... {userId: ${userId}}`);
    return this.reviewsService.getReviewsByUser(userId);
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
