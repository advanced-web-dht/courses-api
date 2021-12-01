import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PointService } from './point.service';
import { Point } from './point.entity';

@Module({
	imports: [SequelizeModule.forFeature([Point])],
	providers: [PointService]
})
export class PointModule {}
