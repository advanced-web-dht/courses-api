import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Course } from './course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

@Module({
	imports: [SequelizeModule.forFeature([Course])],
	controllers: [CourseController],
	providers: [CourseService]
})
export class CoursesModule {}
