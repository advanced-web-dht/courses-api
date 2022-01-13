import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';

import { ReviewService } from './review.service';
import { AddReviewDto } from './review.dto/add-review.dto';
import { MakeReviewDoneDto } from './review.dto/make-review-done.dto';
import { PointService } from '../point/point.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService, private readonly pointService: PointService) {}

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
  @Put('/:reviewId/done')
  async MakeReviewDone(
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
    @Param('reviewId') reviewId: number,
    @Body() body: MakeReviewDoneDto
  ): Promise<void> {
    try {
      await this.reviewService.UpdateReviewStatus(reviewId, body.finalPoint);
      await this.pointService.UpdatePoint(body.csId, body.pointPartId, body.finalPoint);

      res.status(202).send({ isSuccess: true });
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:reviewId')
  async GetReview(@Res() res: FastifyReply, @Req() req: FastifyRequest, @Param('reviewId') reviewId: number): Promise<void> {
    try {
      const { studentId } = req.user;
      const result = await this.reviewService.GetReviewById(reviewId, studentId);
      res.status(200).send(result);
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }
}
