/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/auth/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { ItemsProxy } from 'src/items/items.proxy';

@Injectable()
export class ReviewsService {
  private logger = new Logger('ReviewsService', { timestamp: true });
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private authService: AuthService,
    private itemsService: ItemsProxy,
  ) {}

  async getReviewsByItem(itemId: string): Promise<Review[]> {
    await this.itemsService.getItemById(itemId);

    try {
      const reviews = await this.reviewRepository.find({
        where: { item: { id: itemId } },
      });
      return reviews;
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to get reviews for item {itemId: ${itemId}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    await this.authService.getUserById(userId);

    try {
      const reviews = await this.reviewRepository.find({
        where: { author: { id: userId } },
        relations: ['item'],
      });
      return reviews;
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to get reviews for user {userId: ${userId}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createReview(
    createReviewDto: CreateReviewDto,
    user: User,
    itemId: string,
  ): Promise<void> {
    const reviews = await this.getReviewsByUser(user.id);
    const sameReview = reviews.find((review) => review.item.id === itemId);

    if (sameReview) {
      this.logger.error(
        `[ALREADY EXISTS] Failed to create a review {user: ${user.username}, itemId: ${itemId}}`,
      );
      throw new ConflictException(
        'This user has already added a review for this item',
      );
    }

    const item = await this.itemsService.getItemById(itemId);

    const { usePeriod, liked, disliked, text } = createReviewDto;

    const likedChecked = liked ? liked : 'Не визначено';
    const dislikedChecked = disliked ? disliked : 'Не визначено';

    const review = this.reviewRepository.create({
      item: item,
      author: user,
      usePeriod,
      liked: likedChecked,
      disliked: dislikedChecked,
      text,
    });

    try {
      await this.reviewRepository.save(review);
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to create a review {item: ${item.name}, user: ${user.username}}`,

        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
