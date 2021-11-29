import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PointPart } from './point-part.entity';
import { PointPartService } from './point-part.service';
import { AccountController } from '../account/account.controller';
import { PointPartController } from './point-part.controller';

@Module({
	imports: [SequelizeModule.forFeature([PointPart])],
	controllers: [PointPartController],
	providers: [PointPartService]
})
export class PointPartModule {}
