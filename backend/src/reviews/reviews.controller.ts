import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/auth/user.entity';
import { Review } from './review.entity';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ReviewsServiceInterface } from './reviews-service.interface';
import { ModeratorGuard } from 'src/common/decorators/guards/moderator.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(
    @Inject('REVIEWS_SERVICE') private reviewsService: ReviewsServiceInterface,
  ) {}

  @Get('item/:itemId')
  getReviewsByItem(
    @Param('itemId') itemId: string,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginationDto<Review>> {
    return this.reviewsService.getReviewsByItem(itemId, pagination);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard())
  getReviewsByUser(
    @Param('userId') userId: string,
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginationDto<Review>> {
    return this.reviewsService.getReviewsByUser(userId, pagination);
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

  @Delete('/:reviewId')
  @UseGuards(ModeratorGuard)
  deleteReview(@Param('reviewId') reviewId: string): Promise<void> {
    return this.reviewsService.deleteReview(reviewId);
  }
}
