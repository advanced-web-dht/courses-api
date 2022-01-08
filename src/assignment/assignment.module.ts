import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Assignment } from './assignment.entity';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { AuthModule } from '../auth/auth.module';
import { ClassTeacher } from '../entities/class-teacher.entity';

@Module({
  imports: [SequelizeModule.forFeature([Assignment, ClassTeacher]), AuthModule],
  controllers: [AssignmentController],
  providers: [AssignmentService]
})
export class AssignmentModule {}
