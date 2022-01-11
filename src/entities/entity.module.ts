import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ClassTeacher } from './class-teacher.entity';
import { ClassStudent } from './class-student.entity';
import { Comment } from './comment.entity';

@Module({
  imports: [SequelizeModule.forFeature([ClassTeacher, ClassStudent, Comment])]
})
export class EntityModule {}
