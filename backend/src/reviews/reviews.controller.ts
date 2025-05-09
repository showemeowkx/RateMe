import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Review } from './review.entity';

@Controller('reviews')
export class ReviewsController {
  private logger = new Logger('ReviewsController');
  constructor(private reviewsService: ReviewsService) {}

  @Get('item/:itemId')
  getReviewsByItem(@Param('itemId') itemId: string): Promise<Review[]> {
    this.logger.verbose(`Getting reviews for item... {itemId: ${itemId}}`);
    return this.reviewsService.getReviewsByItem(itemId);
  }

  @UseGuards(AuthGuard())
  @Post('/:itemId')
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
