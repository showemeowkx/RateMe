import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/auth/user.entity';
import { Review } from './review.entity';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { StreamifyInterceptor } from 'src/common/interceptors/streamify.interceptor';
import { ReviewsProxy } from './reviews.proxy';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsProxy) {}

  @Get('item/:itemId')
  @UseInterceptors(StreamifyInterceptor)
  getReviewsByItem(@Param('itemId') itemId: string): Promise<Review[]> {
    return this.reviewsService.getReviewsByItem(itemId);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard())
  @UseInterceptors(StreamifyInterceptor)
  getReviewsByUser(@Param('userId') userId: string): Promise<Review[]> {
    return this.reviewsService.getReviewsByUser(userId);
  }

  @Post('/:itemId')
  @UseGuards(AuthGuard())
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: User,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.reviewsService.createReview(createReviewDto, user, itemId);
  }
}
