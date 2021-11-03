import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { nanoid } from 'nanoid';

import { Class } from './class.entity';
import { createClassDto } from './class.dto/create-class.dto';

@Injectable()
export class ClassService {
	constructor(
		@InjectModel(Class)
		private classModel: typeof Class
	) {}

	async CreateClass({ name }: createClassDto): Promise<Class> {
		const code = nanoid(8);
		const classToAdd = {
			name,
			code
		};
		try {
			const newClass = await this.classModel.create(classToAdd);
			return newClass;
		} finally {
			// do nothing
		}
	}

	async getAll(): Promise<Class[]> {
		return await this.classModel.findAll();
	}
}
