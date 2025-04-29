import {
  ConflictException,
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
import { Item } from 'src/items/item.entity';

@Injectable()
export class ReviewsService {
  private logger = new Logger('ReviewsService', { timestamp: true });
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createReview(
    createReviewDto: CreateReviewDto,
    user: User,
    itemId: string,
  ): Promise<void> {
    //will be rapleced with GET method
    const sameReview = await this.reviewRepository.findOneBy({
      author: user,
      item: { id: itemId },
    });

    if (sameReview) {
      this.logger.error(
        `[ALREADY EXISTS] Failed to create a review {user: ${user.username}, itemId: ${itemId}}`,
      );
      throw new ConflictException(
        'This user has already added a review for this item',
      );
    }

    //will be rapleced with GET method
    const item = await this.itemRepository.findOneBy({ id: itemId });

    if (!item) {
      this.logger.error(
        `[NOT FOUND] Failed to create a review {user: ${user.username}, itemId: ${itemId}}`,
      );
      throw new NotFoundException(`Item with id ${itemId} was not found`);
    }

    const { usePeriod, isRecommended, liked, disliked, text } = createReviewDto;

    const isRecommendedCheck = isRecommended ? true : false;
    const likedChecked = liked ? liked : 'Не визначено';
    const dislikedChecked = disliked ? disliked : 'Не визначено';

    const review = this.reviewRepository.create({
      origin: 'rateMe',
      item: item,
      author: user,
      usePeriod,
      isRecommended: isRecommendedCheck,
      liked: likedChecked,
      disliked: dislikedChecked,
      text,
    });

    try {
      await this.reviewRepository.save(review);
    } catch (error) {
      this.logger.error(
        `[INTERNAL] Failed to create a review {item: ${item.name}, user: ${user.username}}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
