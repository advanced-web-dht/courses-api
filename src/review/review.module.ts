import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './review.entity';
import { ReviewController } from './review.controller';

@Module({
  imports: [SequelizeModule.forFeature([Review])],
  providers: [ReviewService],
  controllers: [ReviewController]
})
export class ReviewModule {}
