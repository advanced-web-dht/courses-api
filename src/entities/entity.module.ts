import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ClassTeacher } from './class-teacher.entity';
import { ClassStudent } from './class-student.entity';

@Module({
  imports: [SequelizeModule.forFeature([ClassTeacher, ClassStudent])]
})
export class EntityModule {}
