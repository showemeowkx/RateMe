/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/auth/user.entity';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { paginate } from 'src/common/pagination/pagination';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { ItemsServiceInterface } from 'src/items/items-service.interfase';
import { ReviewsServiceInterface } from './reviews-service.interface';
import { AuthServiceInterface } from 'src/auth/auth-service.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AnalyzeReviewDto } from './dto/analyze-review.dto';

@Injectable()
export class ReviewsService implements ReviewsServiceInterface {
  private logger = new Logger('ReviewsService', { timestamp: true });
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @Inject('AUTH_SERVICE') private authService: AuthServiceInterface,
    @Inject('ITEMS_SERVICE') private itemsService: ItemsServiceInterface,
    private httpService: HttpService,
  ) {}

  private MODEL_URL: string = `http://${
    process.env.NODE_ENV === 'production'
      ? process.env.MODEL_HOST_PROD
      : process.env.MODEL_HOST_DEV
  }:${process.env.MODEL_PORT}`;

  async getReviewsByItem(
    itemId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationDto<Review>> {
    await this.itemsService.getItemById(itemId);

    try {
      const query = this.reviewRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.author', 'author')
        .where('review.item.id = :itemId', { itemId })
        .select([
          'review.id',
          'review.usePeriod',
          'review.liked',
          'review.disliked',
          'review.text',
          'review.isPositive',
          'author.id',
          'author.imagePath',
          'author.name',
          'author.username',
          'author.isModerator',
        ]);

      return paginate(query, pagination.page, pagination.limit);
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to get reviews for item {itemId: ${itemId}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getReviewsByUser(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationDto<Review>> {
    await this.authService.getUserById(userId);

    try {
      const query = this.reviewRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.item', 'item')
        .where('review.author.id = :userId', { userId })
        .select([
          'review.id',
          'review.usePeriod',
          'review.liked',
          'review.disliked',
          'review.text',
          'review.isPositive',
          'item.id',
          'item.imagePath',
          'item.name',
        ]);

      return paginate(query, pagination.page, pagination.limit);
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
    const pagination: PaginationQueryDto = {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    };
    const reviews = (await this.getReviewsByUser(user.id, pagination)).items;
    const sameReview = reviews.find((review) => review.item.id === itemId);

    if (sameReview) {
      console.log(sameReview);
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

    const reviewData: AnalyzeReviewDto = {
      experience: usePeriod.toLowerCase(),
      liked: likedChecked,
      disliked: dislikedChecked,
      comment: text,
    };

    const isPositive = await this.analyzeReview(reviewData);

    const review = this.reviewRepository.create({
      item: item,
      author: user,
      usePeriod,
      liked: likedChecked,
      disliked: dislikedChecked,
      text,
      isPositive,
    });

    try {
      await this.reviewRepository.save(review).then(async () => {
        const paginationDto = { page: 1, limit: Number.MAX_SAFE_INTEGER };
        await this.getReviewsByItem(itemId, paginationDto).then(
          async (itemReviews) => {
            await this.itemsService.updateItem(itemId, itemReviews.items);
          },
        );
      });
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to create a review {user: ${user.username}, itemId: ${itemId}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async analyzeReview(analyzeReviewDto: AnalyzeReviewDto): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<{ isRecommended: 0 | 1 }>(
          this.MODEL_URL,
          analyzeReviewDto,
        ),
      );
      const responseData = response.data;
      const isPositive = responseData.isRecommended === 1;
      this.logger.verbose(
        `Received from model: ${JSON.stringify(responseData)}`,
      );
      return isPositive;
    } catch (error) {
      this.logger.error('[MODEL] Failed to analyze a review', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteReview(reviewId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['item'],
      select: { item: { id: true } },
    });

    if (!review) {
      this.logger.error(
        `[NOT FOUND] Failed to delete a review {reviewId: ${reviewId}}`,
      );
      throw new NotFoundException(
        `A review with id '${reviewId}' doesn't exist`,
      );
    }

    try {
      const itemId = review.item.id;
      await this.reviewRepository.remove(review).then(async () => {
        const paginationDto = { page: 1, limit: Number.MAX_SAFE_INTEGER };
        await this.getReviewsByItem(itemId, paginationDto).then(
          async (itemReviews) => {
            await this.itemsService.updateItem(itemId, itemReviews.items);
          },
        );
      });
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to delete a review {reviewId: ${reviewId}}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
