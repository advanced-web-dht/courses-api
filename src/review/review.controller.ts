import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReviewService } from './review.service';
import { FastifyReply } from 'fastify';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/account/:accountId/grade/:pointPartId')
  async GetReviewOfGradeOfAccount(
    @Res() res: FastifyReply,
    @Param('accountId') accountId: number,
    @Param('pointPartId') pointPartId: number
  ): Promise<void> {
    try {
      const result = await this.reviewService.GetReviewOfGradeOfAccount(accountId, pointPartId);
      res.status(200).send(result);
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }
}
