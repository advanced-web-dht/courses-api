import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PointPart } from './point-part.entity';
import { PointPartService } from './point-part.service';
import { PointPartController } from './point-part.controller';
import { Class } from '../class/class.entity';
import { PointModule } from '../point/point.module';
import { ClassStudent } from '../entities/class-student.entity';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [SequelizeModule.forFeature([PointPart, Class, ClassStudent]), PointModule, AccountModule],
  controllers: [PointPartController],
  providers: [PointPartService]
})
export class PointPartModule {}
