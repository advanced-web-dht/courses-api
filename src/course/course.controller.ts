import { Controller, Get, Post } from '@nestjs/common';

import { CourseService } from './course.service';
import { Course } from './course.entity';

@Controller('/courses')
export class CourseController {
	constructor(private readonly appService: CourseService) {}

	@Get()
	async getAll(): Promise<Course[]> {
		return this.appService.getAllCourses();
	}
	@Post()
	async addCourse(): Promise<Course> {
		const name = 'PTUDWNC';
		return await this.appService.addCourse(name);
	}
}
