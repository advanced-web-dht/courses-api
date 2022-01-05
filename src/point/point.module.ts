import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PointService } from './point.service';
import { Point } from './point.entity';
import { AccountModule } from '../account/account.module';
import { PointController } from './point.controller';

@Module({
  imports: [SequelizeModule.forFeature([Point]), AccountModule],
  controllers: [PointController],
  providers: [PointService]
})
export class PointModule {}
