import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewController } from './review.controller';
import { AuthModule } from '../auth/auth.module';
import { Review } from './review.entity';
import { Comment } from '../entities/comment.entity';
import { PointModule } from '../point/point.module';
import { ReviewListener } from './review.listener';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [SequelizeModule.forFeature([Review, Comment]), AuthModule, PointModule, ClassModule],
  providers: [ReviewService, ReviewListener],
  controllers: [ReviewController]
})
export class ReviewModule {}
