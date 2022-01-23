import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PointService } from './point.service';
import { Point } from './point.entity';
import { PointController } from './point.controller';

@Module({
  imports: [SequelizeModule.forFeature([Point])],
  controllers: [PointController],
  exports: [PointService],
  providers: [PointService]
})
export class PointModule {}
