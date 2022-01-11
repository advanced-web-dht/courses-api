import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';

import { ReviewService } from './review.service';
import { AddReviewDto } from './review.dto/add-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/account/grade/:pointPartId')
  async GetReviewOfGradeOfAccount(
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
    @Param('pointPartId') pointPartId: number
  ): Promise<void> {
    try {
      const { id } = req.user;
      const result = await this.reviewService.GetReviewOfGradeOfAccount(id, pointPartId);
      res.status(200).send(result);
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async PostNewReview(@Res() res: FastifyReply, @Req() req: FastifyRequest, @Body() body: AddReviewDto): Promise<void> {
    try {
      const { id } = req.user;
      await this.reviewService.AddNewReview(body, id);
      res.status(200).send({ isSuccess: true });
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/comments')
  async PostNewComment(
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
    @Body('message') message: string,
    @Param('id') reviewId: number
  ): Promise<void> {
    try {
      const { id } = req.user;
      await this.reviewService.AddNewComment(reviewId, id, message);
      res.status(200).send({ isSuccess: true });
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/class/:classId')
  async GetReviewsOfClass(@Res() res: FastifyReply, @Req() req: FastifyRequest, @Param('classId') classId: number): Promise<void> {
    try {
      const result = await this.reviewService.GetReviewsOfClass(classId);
      res.status(200).send(result);
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:reviewId')
  async GetReview(@Res() res: FastifyReply, @Param('reviewId') reviewId: number): Promise<void> {
    try {
      const result = await this.reviewService.GetReviewById(reviewId);
      res.status(200).send(result);
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }
}
