import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from './course.entity';

@Injectable()
export class CourseService {
	constructor(
		@InjectModel(Course)
		private courseModel: typeof Course
	) {}

	async addCourse(name: string): Promise<Course> {
		const newCourse = {
			name,
			dateBegin: new Date(),
			isActive: true
		};
		return await this.courseModel.create(newCourse);
	}

	async getAllCourses(): Promise<Course[]> {
		return await this.courseModel.findAll();
	}
}
