import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewController } from './review.controller';
import { AuthModule } from '../auth/auth.module';
import { Review } from './review.entity';
import { Comment } from '../entities/comment.entity';

@Module({
  imports: [SequelizeModule.forFeature([Review, Comment]), AuthModule],
  providers: [ReviewService],
  controllers: [ReviewController]
})
export class ReviewModule {}
