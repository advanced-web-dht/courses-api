import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PointPart } from './point-part.entity';
import { PointPartService } from './point-part.service';
import { PointPartController } from './point-part.controller';
import { Point } from '../point/point.entity';
import { Account } from '../account/account.entity';
import { Class } from '../class/class.entity';

@Module({
  imports: [SequelizeModule.forFeature([PointPart, Class])],
  controllers: [PointPartController],
  providers: [PointPartService]
})
export class PointPartModule {}
