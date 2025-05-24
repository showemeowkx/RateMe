import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/auth/user.entity';
import { Review } from './review.entity';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { StreamifyInterceptor } from 'src/common/interceptors/streamify.interceptor';

@Controller('reviews')
export class ReviewsController {
  private logger = new Logger('ReviewsController');
  constructor(private reviewsService: ReviewsService) {}

  @Get('item/:itemId')
  @UseInterceptors(StreamifyInterceptor)
  getReviewsByItem(@Param('itemId') itemId: string): Promise<Review[]> {
    this.logger.verbose(`Getting reviews for item... {itemId: ${itemId}}`);
    return this.reviewsService.getReviewsByItem(itemId);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard())
  @UseInterceptors(StreamifyInterceptor)
  getReviewsByUser(@Param('userId') userId: string): Promise<Review[]> {
    this.logger.verbose(`Getting reviews for user... {userId: ${userId}}`);
    return this.reviewsService.getReviewsByUser(userId);
  }

  @Post('/:itemId')
  @UseGuards(AuthGuard())
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: User,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    this.logger.verbose(
      `Creating a review... {user: ${user.username}, itemId: ${itemId},}`,
    );
    return this.reviewsService.createReview(createReviewDto, user, itemId);
  }
}
